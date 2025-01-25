from django.db import models
from django.contrib.contenttypes.models import ContentType

class MembershipRequestManager(models.Manager):
    def create_membershiprequest(self, sender,community, user) -> models.Model :
        """
        :param sender: A Django model instance. Any object can be related.
        :param community: A Django model instance. Any community object can be related.
        :param user: A Django model instance. Any profile object can be related.
        :return: A newly created ``MembershipRequest`` instance.
        """
        
        sender_content_type = ContentType.objects.get_for_model(sender)
        membership_request = self.model.objects.create(
            sender=sender,
            sender_object_id=sender.id,
            sender_content_type=sender_content_type,
            community=community,
            user=user,
        )

        return membership_request
