from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, filters, permissions, status, mixins, generics, parsers, views, pagination
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from djoser.email import ActivationEmail
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from django.db.models import Q
import gzip
from pathlib import Path
from difflib import SequenceMatcher

#
from user.serializers import *
from user.models import *
from user.utils import (
    get_info, 
    get_community_requests, 
    get_user_community_requests,
    get_user_sent_community_requests,
    create_media_files
    )
from user.banned_users import get_cleared


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    lookup_field = 'id'
    permissions_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        user = serializer.save()
        # Send activation email using Djoser's ActivationEmail
        context = {'user': user}
        to = [user.email]
        ActivationEmail(self.request, context).send(to)

    def geo_tag(self, serializer):
        ip_address,country,city,system,device,browser,browser_version = get_info(self.request)
        serializer.validated_data['ip_address'] = ip_address
        serializer.validated_data['country'] = country
        serializer.validated_data['city'] = city
        serializer.validated_data['system'] = system
        serializer.validated_data['device'] = device
        serializer.validated_data['browser'] = browser
        serializer.validated_data['browser_version'] = browser_version

    @action(["post"], detail=True)
    def delete_account(self, request, *args, **kwargs):
        user = self.get_object()
        password = request.data["password"]
        if user.check_password(password):
            # self.perform_destroy(user)
            return Response(_("Account successfully deleted"), status=status.HTTP_204_NO_CONTENT)
        return Response(_("Unathorized action"), status=status.HTTP_401_UNAUTHORIZED)
    
    @action(["post"], detail=True)
    def update_password(self, request, *args, **kwargs):
        serializer = CustomPasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(["get"], detail=True)
    def current_profile_picture(self, request, *args, **kwargs):
        user = self.get_object()
        profile_picture = ProfilePicture.objects.filter(user=user, is_active=True).first()
        if not profile_picture:
            return Response(
                {"error": "No active profile picture found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = ProfilePictureSerializer(profile_picture, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["post"], detail=True)
    def send_friend_request(self, request, *args, **kwargs):
        receiver = self.get_object()
        friend_request, created = Friendship.objects.get_or_create(sender=request.user,receiver=receiver)
        if created:
            serializer = FriendshipSerializer(friend_request, many=False, context={'request': request})
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        self.perform_destroy(friend_request)
        return Response("No content", status=status.HTTP_204_NO_CONTENT)
        

    @action(["get"], detail=False)
    def friend_requests(self, request, *args, **kwargs):
        friend_requests_ids = Friendship.objects.filter(receiver=request.user, is_active=False).values_list("sender_id", flat=True)
        friend_requests = Profile.objects.filter(id__in=friend_requests_ids)
        friend_requests = get_cleared(request,friend_requests)
        page = self.paginate_queryset(friend_requests)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(friend_requests, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["get"], detail=False)
    def sent_friend_requests(self, request, *args, **kwargs):
        friend_requests_ids = Friendship.objects.filter(sender=request.user, is_active=False).values_list("receiver_id", flat=True)
        friend_requests = Profile.objects.filter(id__in=friend_requests_ids)
        friend_requests = get_cleared(request,friend_requests)
        page = self.paginate_queryset(friend_requests)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(friend_requests, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["post"], detail=True)
    def accept_friend_request(self, request, *args, **kwargs):
        user = self.get_object()
        friend_request = get_object_or_404(Friendship, sender=user, receiver=request.user, is_active=False)
        friend_request.is_active = True
        friend_request.save()
        serializer = FriendshipSerializer(friend_request, many=False, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["post"], detail=True)
    def reject_friend_request(self, request, *args, **kwargs):
        user = self.get_object()
        friend_request = get_object_or_404(Friendship, sender=user, receiver=request.user, is_active=False)
        friend_request.delete()
        return Response("No content", status=status.HTTP_204_NO_CONTENT)

    @action(["get"], detail=True)
    def friendslist(self, request, *args, **kwargs):
        user = self.get_object()
        friends_ids = Friendship.objects.filter(
            Q(sender=user, is_active=True) | Q(receiver=user, is_active=True)
        ).select_related("sender", "receiver").values("sender_id", "receiver_id").values_list(flat=True)
        friends_status = Friendship.objects.filter(
            Q(sender=user, receiver=request.user, is_active=True) | Q(receiver=user, sender=request.user, is_active=True)
        ).select_related("sender", "receiver")
        if friends_status.exists():
            friends = Profile.objects.filter(id__in=set(friends_ids))
            friends = get_cleared(request,friends)
            friends.exclude(id=user.id)
            page = self.paginate_queryset(friends)
            if page is not None:
                serializer = self.get_serializer(page, many=True, context={'request': request})
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(friends, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("Unauthorized action", status=status.HTTP_401_UNAUTHORIZED)
    
    @action(["get"], detail=False)
    def my_friends(self, request, *args, **kwargs):
        user = request.user
        friends_ids = Friendship.objects.filter(
            Q(sender=user, is_active=True) | Q(receiver=user, is_active=True)
        ).select_related("sender", "receiver").values("sender_id", "receiver_id").values_list(flat=True)
        friends = Profile.objects.filter(id__in=set(friends_ids))
        friends = get_cleared(request,friends)
        page = self.paginate_queryset(friends)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(friends, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["get"], detail=True)
    def friendship_status(self, request, *args, **kwargs):
        me = request.user
        user = self.get_object()
        friendship_status0 = Friendship.objects.filter(sender=user,receiver=me, is_active=True)
        friendship_status1 = Friendship.objects.filter(sender=me,receiver=user, is_active=True)
        if friendship_status0.exists() or friendship_status1.exists():
            return Response({"status":True}, status=status.HTTP_200_OK)
        return Response({"status":False}, status=status.HTTP_200_OK)
        
    @action(["get"], detail=False)
    def community_requests(self, request, *args, **kwargs):
        community_requests = get_user_community_requests(request)
        serializer = MembershipRequestSerializer(community_requests, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["post"], detail=False)
    def send_community_request(self, request, *args, **kwargs):
        user = request.user
        community = get_object_or_404(Community, id=request.data["id"])
        community_request = MembershipRequest.requests.create_membershiprequest(user,community, user)
        serializer = MembershipRequestSerializer(community_request, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(["get"], detail=False)
    def sent_community_requests(self, request, *args, **kwargs):
        community_requests = get_user_sent_community_requests(request)
        serializer = MembershipRequestSerializer(community_requests, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["post"], detail=True)
    def follow(self, request, *args, **kwargs):
        me = request.user
        user = self.get_object()
        follow, created = Follower.objects.get_or_create(user=me, followed_user=user)
        if created:
            serializer = FollowerSerializer(follow, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        self.perform_destroy(follow)
        return Response("No Content", status=status.HTTP_204_NO_CONTENT)
        

    @action(["get"], detail=True)
    def followers(self, request, *args, **kwargs):
        user = self.get_object()
        followers_ids = Follower.objects.filter(followed_user=user).values_list('user', flat=True)
        followers = Profile.objects.filter(id__in=followers_ids)
        followers = get_cleared(request,followers)
        page = self.paginate_queryset(followers)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(followers, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(["get"], detail=True)
    def following(self, request, *args, **kwargs):
        user = self.get_object()
        following_ids = Follower.objects.filter(user=user).values_list('followed_user', flat=True)
        following = Profile.objects.filter(id__in=following_ids)
        following = get_cleared(request,following)
        page = self.paginate_queryset(following)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(following, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            self.geo_tag(serializer)
            self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        serializer = ProfileProcessingSerializer(instance=request.user, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("BAD REQUEST", status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        serializer = ProfileProcessingSerializer(instance=request.user, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            kwargs['partial'] = True
            return self.update(request, *args, **kwargs)
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        password = request.data["password"]
        if user.check_password(password):
            user.delete()
            return Response(_("Account successfully deleted"), status=status.HTTP_204_NO_CONTENT)
        return Response(_("Unathorized action"), status=status.HTTP_401_UNAUTHORIZED)

    def get_queryset(self):
        return get_cleared(self.request,Profile.objects.all())

    def get_serializer_class(self):
        if self.request.user.is_staff:
            self.serializer_class = AdminProfileSerializer
        else:
            self.serializer_class = ProfileSerializer
        return super(ProfileViewSet, self).get_serializer_class()

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = (permissions.AllowAny,)
        else:
            self.permission_classes = (permissions.IsAuthenticated,)
        return super(ProfileViewSet, self).get_permissions()

class UsedEmailsView(views.APIView):

    def get(self, request, *args, **kwargs):
        used_emails = []
        users = Profile.objects.all()
        for user in users:
            used_emails.append(user.email)
        return Response(used_emails)
    
class CommonPasswordsView(views.APIView):

    def get(self, request, *args, **kwargs):
        try:
            with gzip.open(Path(__file__).resolve().parent / "common-passwords.txt.gz", "rt", encoding="utf-8") as f:
                passwords = {x.strip() for x in f}
                return Response(passwords)
        except OSError:
            with open(Path(__file__).resolve().parent / "common-passwords.txt.gz") as f:
                passwords = {x.strip() for x in f}
                return Response(passwords)

class NumericPasswordValidator(views.APIView):

    def post(self, request, *args, **kwargs):
        password =  request.data['password']
        if password.isdigit():
            return Response(_("Your password can’t be entirely numeric."), status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        return Response(status=status.HTTP_200_OK)

class UserAttributeSimilarityValidator(views.APIView):
    
    def post(self, request, *args, **kwargs):
        password =  request.data['password']
        email = request.data['email']
        username = request.data['username']
        password = password.lower()
        email_lower = email.lower()
        username_lower = username.lower()
        if SequenceMatcher(a=password, b=email_lower).quick_ratio() >= 0.5:
            return Response(_(f"The password is too similar to {email}."), status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        elif SequenceMatcher(a=password, b=username_lower).quick_ratio() >= 0.5:
            return Response(_(f"The password is too similar to {username}."), status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        return Response(_("Ok"), status=status.HTTP_200_OK)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class CommunityViewSet(viewsets.ModelViewSet):
    serializer_class = CommunitySerializer
    lookup_field = 'id'
    permissions_classes = (permissions.IsAuthenticated,)

    def add_creator(self, serializer:CommunitySerializer):
        serializer.initial_data['created_by'] = self.request.user
        return serializer
    
    def add_user_(self,serializer:MembershipRequestSerializer,user_id:int):
        try:
            serializer.initial_data['user'] = Profile.objects.get(id=user_id)
            return serializer
        except Profile.DoesNotExist():
            return serializer
    

    @action(["post"], detail=True)
    def add_member(self, request, *args, **kwargs):
        community = self.get_object()
        try:
            user = Profile.objects.get(id=request.data['user_id'])
        except:
            return Response(_("User does not exist"), status=status.HTTP_400_BAD_REQUEST)
        community_role = CommunityRole.objects.filter(
            community=community, 
            user=request.user
        ).first()

        if not community_role or community_role.role not in ["Admin", "Moderator"]:
            raise ValidationError({
                "error": "You are not authorized to create posts in this community."
            })
        community_request = MembershipRequest.requests.create_membershiprequest(community,community, user)
        serializer = MembershipRequestSerializer(community_request, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(["post"], detail=True)
    def remove_member(self, request, *args, **kwargs):
        community = self.get_object()
        try:
            user = Profile.objects.get(id=request.data['user_id'])
        except:
            return Response(_("User does not exist"), status=status.HTTP_400_BAD_REQUEST)
        community_role = CommunityRole.objects.filter(
            community=community, 
            user=request.user
        ).first()

        if not community_role or community_role.role not in ["Admin", "Moderator"]:
            raise ValidationError({
                "error": "You are not authorized to create posts in this community."
            })
        member_role = CommunityRole.objects.filter(community=community, user=user)
        member_role.delete()
        community.members.remove(user)
        community.save()
        serializer = self.serializer_class(community)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["get"], detail=True)
    def community_requests(self, request, *args, **kwargs):
        community = self.get_object()
        community_requests = get_community_requests(request,community)
        serializer = MembershipRequestSerializer(community_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(["post"], detail=True)
    def group_chat_add(self, request, *args, **kwargs):
        community = self.get_object()
        data = request.data
        user = get_object_or_404(Profile, id=data['user_id'])
        room = get_object_or_404(ChatRoom, id=data['room_id'], community=community)
        community_role = CommunityRole.objects.filter(
            community=community, 
            user=request.user
        ).first()

        if not community_role or community_role.role not in ["Admin", "Moderator"]:
            raise ValidationError({
                "error": "You are not authorized to create posts in this community."
            })
        if community.members.filter(id=user.id).exists():
            room.members.add(user)
            return Response(_("User added"), status=status.HTTP_200_OK)
        return Response(_("User not in group"), status=status.HTTP_400_BAD_REQUEST)
    
    @action(["post"], detail=True)
    def group_chat_remove(self, request, *args, **kwargs):
        community = self.get_object()
        data = request.data
        user = get_object_or_404(Profile, id=data['user_id'])
        room = get_object_or_404(ChatRoom, id=data['room_id'], community=community)
        community_role = CommunityRole.objects.filter(
            community=community, 
            user=request.user
        ).first()

        if not community_role or community_role.role not in ["Admin", "Moderator"]:
            raise ValidationError({
                "error": "You are not authorized to create posts in this community."
            })
        if community.members.filter(id=user.id).exists():
            room.members.remove(user)
            return Response(_("User added"), status=status.HTTP_200_OK)
        return Response(_("User not in group"), status=status.HTTP_400_BAD_REQUEST)
        

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer = self.add_creator(serializer)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        community = self.get_object()
        try:
            user_role = CommunityRole.objects.get(community=community, user=self.request.user)
            if user_role.role in ["Moderator", "Admin"]:
                serializer = self.serializer_class(instance=community, data=request.data, context={'request': request})
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(_("Unknown action"), status=status.HTTP_400_BAD_REQUEST)
        except CommunityRole.DoesNotExist:
            return Response(_("Unauthorized action"), status=status.HTTP_401_UNAUTHORIZED)
        
    def destroy(self, request, *args, **kwargs):
        community = self.get_object()
        if request.user == community.created_by:
            self.perform_destroy(community)
            return Response("No Content", status=status.HTTP_204_NO_CONTENT)
        return Response(_("Unauthorized action"), status=status.HTTP_401_UNAUTHORIZED)

    def get_queryset(self):
        return Community.objects.all()
# Create your views here.


class MessagePagination(pagination.PageNumberPagination):
    page_size = 50  # Default page size
    page_size_query_param = 'page_size'
    max_page_size = 100  # Limit maximum messages fetched

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated,]
    pagination_class = MessagePagination


    def _create_media_files(self, request, media_files):
        """
        Utility function to create media files.
        """
        media_instances = []
        for file_data in media_files:
            media = MediaMessage.objects.create(user=request.user, media_file=file_data)
            media_instances.append(media)
        return media_instances

    @action(detail=False, methods=["post"])
    def mark_all_as_read(self, request):
        """
        Marks all messages in a chatroom as read for the user.
        """
        room_id = request.data.get('room_id')
        if not room_id:
            return Response({"error": "Room ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        room = get_object_or_404(ChatRoom, id=room_id)
        if not room.members.filter(id=request.user.id).exists():
            return Response({"error": "You are not a member of this chatroom."}, status=status.HTTP_403_FORBIDDEN)

        unread_messages = Message.objects.filter(room=room).exclude(is_read=request.user)
        for message in unread_messages:
            message.is_read.add(request.user)

        return Response({"message": "All messages marked as read."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["delete"])
    def bulk_delete(self, request):
        message_ids = request.data.get('message_ids', [])
        messages = Message.objects.filter(id__in=message_ids, sender=request.user)
        deleted_count = messages.delete()[0]

        return Response(
            {"message": f"{deleted_count} messages deleted successfully."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get"])
    def analytics(self, request, pk=None):
        room = self.get_object()
        total_messages = room.messages.count()
        active_users = room.members.distinct().count()

        return Response({
            "total_messages": total_messages,
            "active_users": active_users
        })

    def create(self, request, *args, **kwargs):
        """
        Creates a new message in a chatroom, optionally attaching media files.
        """
        data = request.data
        room = get_object_or_404(ChatRoom, id=data.get('chatroom_id'))
        if not room.members.filter(id=request.user.id).exists():
            return Response({"error": "You are not a member of this chatroom."}, status=status.HTTP_403_FORBIDDEN)

        # Handle media files
        media_files = data.pop('media', [])
        media_instances = self._create_media_files(request, media_files)

        serializer = self.get_serializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(room=room, sender=request.user)

        # Associate media with the message
        if media_instances:
            serializer.instance.media.add(*media_instances)
            serializer.instance.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Marks a message as read when a user other than the sender interacts with it.
        """
        message = self.get_object()
        if request.user != message.sender:
            message.is_read.add(request.user)
            message.save()
            return Response({"message": "Message marked as read."}, status=status.HTTP_200_OK)
        return Response({"message": "Sender cannot mark their own message as read."}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Deletes a message. Only the sender can delete their messages.
        """
        message = self.get_object()
        if request.user != message.sender:
            return Response({"error": "You are not authorized to delete this message."}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(message)
        return Response({"message": "Message deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    

        def get_queryset(self):
            """
            Retrieves messages for a user. If a `room_id` query parameter is provided,
            it filters messages belonging to that chatroom, ensuring the user is a member.
            """
            room_id = self.request.query_params.get('room_id')
            if room_id:
                room = get_object_or_404(ChatRoom, id=room_id)
                if not room.members.filter(id=self.request.user.id).exists():
                    return Message.objects.none()  # User is not part of the room
                return Message.objects.filter(room=room).order_by('-timestamp')
            return Message.objects.filter(sender=self.request.user).order_by('-timestamp')






