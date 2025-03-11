from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.signals import notify
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from user.models import Community, CommunityRole, MembershipRequest, Friendship,ChatRoom,ProfilePicture,Profile,Follower

@receiver(post_save, sender=Community)
def create_community(sender, instance, created, **kwargs):
    if created:
        role = CommunityRole.objects.create(user=instance.created_by,community=instance,role='Admin')
        role.save()
        name = f"{instance.name} group chat"
        chat = ChatRoom.objects.create(name=name, is_group=True)
        chat.members.add(instance.created_by)
        chat.save()

# for request if approved add to community if declined delete request
@receiver(post_save, sender=MembershipRequest)
def membership_request(sender, instance, **kwargs):
    if instance.status == 'Approved':
        community = instance.community
        community.members.add(instance.user)
        community.save()
        role = CommunityRole.objects.create(user=instance.user,community=community,role='Member')
        role.save()
    elif instance.status == 'Declined':
        instance.delete()

@receiver(post_save, sender=Friendship)
def friendship_status(sender, instance, **kwargs):
    if instance.is_active:
        name = f"{instance.sender.username} chat with {instance.receiver.username}"
        room = ChatRoom.objects.filter(members=instance.sender)
        room = room.filter(members=instance.receiver)
        if room.exists():
            return
        chat = ChatRoom.objects.create(name=name, is_group=False)
        chat.members.add(instance.sender)
        chat.members.add(instance.receiver)
        chat.save()

@receiver(post_save, sender=ProfilePicture)
def update_profile_picture(sender, instance, **kwargs):
    if instance.is_active:
        friends_ids = Friendship.objects.filter(
            Q(sender=instance.user, is_active=True) | Q(receiver=instance.user, is_active=True)
        ).select_related("sender", "receiver").values("sender_id", "receiver_id").values_list(flat=True)
        friends = Profile.objects.filter(id__in=set(friends_ids))
        followers_ids = Follower.objects.filter(followed_user=instance.user).values_list('user', flat=True)
        followers = Profile.objects.filter(id__in=followers_ids)
        users = friends.union(followers).distinct()
        try:
            notify.send(
                instance.user,
                recipient=users, 
                verb=_(
                f'{instance.user} updated their profile picture'),
                action_object=instance,
                description="profile",
            )
        except Exception as e:
            print(e)
