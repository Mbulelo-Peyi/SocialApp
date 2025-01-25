from django.db import models
from django.http import HttpRequest
from django.contrib.contenttypes.models import ContentType

from user.utils import get_info




class PostManager(models.Manager):
    """
    Custom ``Post`` model manager that implements a method to create a new
    object instance from and using HTTP request for geo-location.
    """
    def create_post(self, request, author,content,scheduled_time=None) -> models.Model :
        """
        Given an ``HTTPRequest`` object and a generic content, it creates a
        ``Post`` object to store the data of that request.

        :param request: A Django ``HTTPRequest`` object.
        :param content_object: A Django model instance. Any object can be
        related.
        :return: A newly created ``Post`` instance.
        """
        # Sanity checks.
        assert isinstance(request, HttpRequest), \
            '`request` object is not an `HTTPRequest`'
        assert issubclass(author.__class__, models.Model), \
            '`content_object` is not a Django model'
        
        _,country,city,system,device,browser,browser_version = get_info(request)
        author_content_type = ContentType.objects.get_for_model(author)
        post = self.model.objects.create(
            author=author,
            author_object_id=author.id,
            author_content_type=author_content_type,
            content=content,
            country=country,
            city=city,
            device=device,
            browser=browser,
            browser_version=browser_version,
            system=system,
            scheduled_time=scheduled_time if scheduled_time else None
        )

        return post

class ReactionManager(models.Manager):
    """
    Custom ``Reaction`` model manager that implements a method to create a new
    object instance from and using HTTP request for geo-location.
    """
    def create_reaction(self, request, user, post, reaction_type) -> models.Model :
        """
        Given an ``HTTPRequest`` object and a generic content, it creates a
        ``Reaction`` object to store the data of that request.

        :param request: A Django ``HTTPRequest`` object.
        :param content_object: A Django model instance. Any object can be
        related.
        :return: A newly created ``Reaction`` instance.
        """
        # Sanity checks.
        assert isinstance(request, HttpRequest), \
            '`request` object is not an `HTTPRequest`'
        assert issubclass(user.__class__, models.Model), \
            '`content_object` is not a Django model'
        
        _,country,city,system,device,browser,browser_version = get_info(request)
        reaction = self.model.objects.create(
            user=user,
            post=post,
            reaction_type=reaction_type,
            country=country,
            city=city,
            device=device,
            browser=browser,
            browser_version=browser_version,
            system=system,
        )

        return reaction
    
class CommentManager(models.Manager):
    """
    Custom ``Comment`` model manager that implements a method to create a new
    object instance from and using HTTP request for geo-location.
    """
    def create_comment(self, request, user, post, content) -> models.Model :
        """
        Given an ``HTTPRequest`` object and a generic content, it creates a
        ``Comment`` object to store the data of that request.

        :param request: A Django ``HTTPRequest`` object.
        :param content_object: A Django model instance. Any object can be
        related.
        :return: A newly created ``Comment`` instance.
        """
        # Sanity checks.
        assert isinstance(request, HttpRequest), \
            '`request` object is not an `HTTPRequest`'
        assert issubclass(user.__class__, models.Model), \
            '`content_object` is not a Django model'
        
        _,country,city,system,device,browser,browser_version = get_info(request)
        comment = self.model.objects.create(
            user=user,
            post=post,
            content=content,
            country=country,
            city=city,
            device=device,
            browser=browser,
            browser_version=browser_version,
            system=system,
        )

        return comment

