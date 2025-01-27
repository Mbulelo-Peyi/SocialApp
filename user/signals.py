from django.db.models.signals import post_save
from django.dispatch import receiver
from user.models import Community, CommunityRole, MembershipRequest, Friendship,ChatRoom


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
        chat = ChatRoom.objects.create(name=name, is_group=False)
        chat.members.add(instance.sender)
        chat.members.add(instance.receiver)
        chat.save()