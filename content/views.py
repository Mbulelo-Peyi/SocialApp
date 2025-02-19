from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, filters, permissions, status, mixins, generics, parsers, views, pagination
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType

#
from content.serializers import *
from content.models import *
from content.helpers import create_media,get_tags,get_hashtags
from content.utils import get_community_model, cleaned_posts
from user.models import CommunityRole, Follower, Friendship



Profile = get_user_model()
Community = get_community_model()

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated,]

    @action(["post"], detail=True)
    def delete_user_post(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user
        author_content_type = ContentType.objects.get_for_model(user)
        author_object_id = user.id
        if post.author_content_type == author_content_type and post.author_object_id == author_object_id:
            self.perform_destroy(post)
            return Response(_("Post successfully deleted"), status=status.HTTP_204_NO_CONTENT)
        return Response(_("Unathorized action"), status=status.HTTP_401_UNAUTHORIZED)
    
    @action(["post"], detail=True)
    def delete_community_post(self, request, *args, **kwargs):
        post = self.get_object()
        data = request.data
        author_content_type = ContentType.objects.get_for_model(Community)
        author_object_id = data['author_object_id']
        author = content_type.get_object_for_this_type(id=author_object_id)
        community_role = CommunityRole.objects.filter(community=author, user=request.user).first()
        if not community_role or community_role.role not in ["Admin", "Moderator", "Member"]:
            raise ValidationError({"error": "You are not authorized to create posts in this community."})
        if post.author_content_type == author_content_type and post.author_object_id == author_object_id:
            self.perform_destroy(post)
            return Response(_("Post successfully deleted"), status=status.HTTP_204_NO_CONTENT)
        return Response(_("Unathorized action"), status=status.HTTP_401_UNAUTHORIZED)

    @action(["post"], detail=True)
    def create_reaction(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user
        reaction_type = request.data['reaction_type']
        reaction = Reaction.reactions.create_reaction(request, user, post, reaction_type)
        serializer = ReactionSerializer(reaction,many=False)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(["post"], detail=True)
    def update_reaction(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user
        reaction = Reaction.objects.filter(user=user, post=post)
        if user == reaction.user:
            reaction.update(reaction_type=request.data['reaction_type'])
            serializer = ReactionSerializer(reaction,many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(_("Unauthorized action"), status=status.HTTP_401_UNAUTHORIZED)

    @action(["post"], detail=True)
    def delete_reaction(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user
        reaction = Reaction.objects.filter(user=user, post=post)
        if user == reaction.user:
            self.perform_destroy(reaction)
            return Response(_("Reaction successfully deleted"), status=status.HTTP_204_NO_CONTENT)
        return Response(_("Unauthorized action"), status=status.HTTP_401_UNAUTHORIZED)

    def create(self, request, *args, **kwargs):
        data = request.data
        try:
            media_files = data.pop('media')
            tags = data.pop('tags')
            hashtags = data.pop('hashtags')
        except:
            media_files = []
            tags = []
            hashtags = []
        files = create_media(request,media_files)
        tags = get_tags(tags)
        hashtags = get_hashtags(hashtags)
        serializer = self.get_serializer(data=data, context={'request': request})

        author_content_type = data.get("author_content_type")
        author_object_id = data.get("author_object_id")

        if not author_content_type or not author_object_id:
            raise ValidationError({
                "error": "Both 'author_content_type' and 'author_object_id' fields are required."
        })

        try:
            if author_content_type == "profile":
                content_type = ContentType.objects.get(model="profile")
                author = content_type.get_object_for_this_type(id=author_object_id)
                if request.user != author:
                    raise ValidationError({"error": "You are not authorized to create posts for this user."})
                post = Post.posts.create_post(request._request, author,data['content'],data['scheduled_time'])
                post.media.add(*files)
                post.tags.add(*tags)
                post.hashtags.add(*hashtags)
                post.save()
                serializer = self.serializer_class(post, context={'request': request})
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            elif author_content_type == "community":
                content_type = ContentType.objects.get(model="community")
                author = content_type.get_object_for_this_type(id=author_object_id)

                community_role = CommunityRole.objects.filter(
                    community=author, user=request.user
                ).first()

                if not community_role or community_role.role not in ["Admin", "Moderator", "Member"]:
                    raise ValidationError({
                        "error": "You are not authorized to create posts in this community."
                    })
                post = Post.posts.create_post(request._request, author,data['content'],data['scheduled_time'])
                post.media.add(*files)
                post.tags.add(*tags)
                post.hashtags.add(*hashtags)
                post.save()
                serializer = self.serializer_class(post, context={'request': request})
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                raise ValidationError({"error": "Invalid 'author_content_type'. Must be 'profile' or 'community'."})

        except ContentType.DoesNotExist:
            raise ValidationError({"errors": f"Invalid author_content_type: {author_content_type}"})
        except Exception as e:
            raise ValidationError({"errorss": str(e)})


    def update(self, request, *args, **kwargs):
        post = self.get_object()

        # Handle posts created by Profiles
        if isinstance(post.author, Profile):
            if self.request.user == post.author:
                serializer = self.serializer_class(instance=post, data=request.data, context={'request': request})
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(_("Unknown action"), status=status.HTTP_400_BAD_REQUEST)
            return Response(_("Unauthorized action"), status=status.HTTP_401_UNAUTHORIZED)

        # Handle posts created by Communities
        elif isinstance(post.author, Community):
            try:
                user_role = CommunityRole.objects.get(community=post.author, user=self.request.user)
                if user_role.role in ["Moderator", "Admin"]:
                    serializer = self.serializer_class(instance=post, data=request.data, context={'request': request})
                    if serializer.is_valid(raise_exception=True):
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    return Response(_("Unknown action"), status=status.HTTP_400_BAD_REQUEST)
            except CommunityRole.DoesNotExist:
                return Response(_("Unauthorized action"), status=status.HTTP_401_UNAUTHORIZED)

        return Response(_("Unknown error"), status=status.HTTP_400_BAD_REQUEST)


    def get_queryset(self):
        user = self.request.user
        queryset = Post.objects.all()

        author_content_type = ContentType.objects.get_for_model(Community)
        author_object_id = self.request.query_params.get('author_object_id')
        if author_content_type and author_object_id:
            queryset = queryset.filter(
                author_content_type=author_content_type,
                author_object_id=author_object_id
            )
            queryset = queryset.order_by('-created_at')
            return queryset
        author_content_type = ContentType.objects.get_for_model(user)
        author_object_id = user.id
        queryset = queryset.filter(
            author_content_type=author_content_type,
            author_object_id=author_object_id
        )
        queryset = queryset.order_by('-created_at')
        return queryset


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated,]

    @action(["post"], detail=True)
    def like(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.like.filter(id=request.user.id).exists():
            comment.like.remove(request.user)
            comment.save()
        else:
            if comment.dislike.filter(id=request.user.id).exists():
                comment.dislike.remove(request.user)
            comment.like.add(request.user)
            comment.save()
        return Response({"like_count":comment.total_likes}, status=status.HTTP_200_OK)
    
    @action(["post"], detail=True)
    def dislike(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.dislike.filter(id=request.user.id).exists():
            comment.dislike.remove(request.user)
            comment.save()
        else:
            if comment.like.filter(id=request.user.id).exists():
                comment.like.remove(request.user)
            comment.dislike.add(request.user)
            comment.save()
        return Response({"dislike_count":comment.total_dislikes()}, status=status.HTTP_200_OK)

    @action(["get"], detail=True)
    def like_count(self, request, *args, **kwargs):
        comment = self.get_object()
        return Response({"like_count":comment.total_likes()}, status=status.HTTP_200_OK)
    
    @action(["get"], detail=True)
    def dislike_count(self, request, *args, **kwargs):
        comment = self.get_object()
        return Response({"dislike_count":comment.total_dislikes()}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        post_id = data.pop('post_id')
        post = get_object_or_404(Post, id=post_id)
        user = request.user
        content = data['content']
        comment = Comment.comments.create_comment(request, user, post, content)
        serializer = CommentSerializer(comment,many=False, context={'request': request})
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    
    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if request.user == comment.user:
            serializer = self.get_serializer(instance=comment, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response("BAD REQUEST", status=status.HTTP_400_BAD_REQUEST)
        return Response("Unauthorized action", status=status.HTTP_401_UNAUTHORIZED)
    
    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if request.user == comment.user:
            self.perform_destroy(comment)
            return Response(_("Comment successfully deleted"), status=status.HTTP_204_NO_CONTENT)
        return Response("Unauthorized action", status=status.HTTP_401_UNAUTHORIZED)

    def get_queryset(self):
        queryset = Comment.objects.filter(user=self.request.user)
        post_id = self.request.query_params.get('post_id')
        if post_id:
            post = get_object_or_404(Post, id=post_id)
            queryset = queryset.filter(post=post)
            return queryset
        return queryset


class CommentReplyViewSet(viewsets.ModelViewSet):
    serializer_class = CommentReplySerializer
    lookup_field = 'id'
    queryset = CommentReply.objects.all()
    permission_classes = [permissions.IsAuthenticated,]

    @action(["post"], detail=True)
    def like(self, request, *args, **kwargs):
        comment_reply = self.get_object()
        if comment_reply.like.filter(id=request.user.id).exists():
            comment_reply.like.remove(request.user)
            comment_reply.save()
        else:
            if comment_reply.dislike.filter(id=request.user.id).exists():
                comment_reply.dislike.remove(request.user)
            comment_reply.like.add(request.user)
            comment_reply.save()
        return Response({"like_count":comment_reply.total_likes()}, status=status.HTTP_200_OK)
    
    @action(["post"], detail=True)
    def dislike(self, request, *args, **kwargs):
        comment_reply = self.get_object()
        if comment_reply.dislike.filter(id=request.user.id).exists():
            comment_reply.dislike.remove(request.user)
            comment_reply.save()
        else:
            if comment_reply.like.filter(id=request.user.id).exists():
                comment_reply.like.remove(request.user)
            comment_reply.dislike.add(request.user)
            comment_reply.save()
        return Response({"dislike_count":comment_reply.total_dislikes()}, status=status.HTTP_200_OK)

    @action(["get"], detail=True)
    def like_count(self, request, *args, **kwargs):
        comment_reply = self.get_object()
        return Response({"like_count":comment_reply.total_likes()}, status=status.HTTP_200_OK)
    
    @action(["get"], detail=True)
    def dislike_count(self, request, *args, **kwargs):
        comment_reply = self.get_object()
        return Response({"dislike_count":comment_reply.total_dislikes()}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        comment_id = data.pop('comment_id')
        comment = get_object_or_404(Comment, id=comment_id)
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.initial_data['user'] = request.user
        serializer.initial_data['comment'] = comment
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        comment_reply = self.get_object()
        if request.user == comment_reply.user:
            serializer = self.get_serializer(instance=comment_reply, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response("BAD REQUEST", status=status.HTTP_400_BAD_REQUEST)
        return Response("Unauthorized action", status=status.HTTP_401_UNAUTHORIZED)
    
    def destroy(self, request, *args, **kwargs):
        comment_reply = self.get_object()
        if request.user == comment_reply.user:
            self.perform_destroy(comment_reply)
            return Response(_("Comment reply successfully deleted"), status=status.HTTP_204_NO_CONTENT)
        return Response("Unauthorized action", status=status.HTTP_401_UNAUTHORIZED)

    def get_queryset(self):
        queryset = CommentReply.objects.filter(user=self.request.user)
        comment_id = self.request.query_params.get('comment_id')
        if comment_id:
            comment = get_object_or_404(Comment, id=comment_id)
            queryset = queryset.filter(comment=comment)
            return queryset
        return queryset

class UserPostFeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 1. Get posts based on viewed moods
        viewed_post_ids = ViewedPost.objects.filter(user=user).values_list("post_id", flat=True)
        viewed_moods = Post.objects.filter(id__in=viewed_post_ids).values_list("mood", flat=True)
        mood_posts = Post.objects.filter(mood__in=set(viewed_moods))

        # 2. Get posts from friends and following users
        friend_ids = Friendship.objects.filter(
            Q(sender=user, is_active=True) | Q(receiver=user, is_active=True)
        ).values_list("sender_id", "receiver_id")
        friend_ids = set(friend_id for pair in friend_ids for friend_id in pair)  # Flatten list

        following_ids = Follower.objects.filter(user=user).values_list("followed_user_id", flat=True)
        related_user_ids = friend_ids.union(following_ids)

        user_content_type = ContentType.objects.get_for_model(user)
        user_posts = Post.objects.filter(
            author_content_type=user_content_type,
            author_object_id__in=related_user_ids
        )

        # 3. Get posts from communities the user is part of
        community_ids = Community.objects.filter(members=user).values_list("id", flat=True)
        community_content_type = ContentType.objects.get_for_model(Community)
        community_posts = Post.objects.filter(
            author_content_type=community_content_type,
            author_object_id__in=community_ids
        )

        # 4. Combine all post sources
        all_posts = Post.objects.filter(
            id__in=set(
                list(mood_posts.values_list("id", flat=True)) +
                list(user_posts.values_list("id", flat=True)) +
                list(community_posts.values_list("id", flat=True))
            )
        )

        # 5. Clean posts to exclude banned content and order by creation date
        cleaned_queryset = cleaned_posts(request=self.request, posts=all_posts)
        return cleaned_queryset.order_by("-created_at")
    

# Create your views here.
