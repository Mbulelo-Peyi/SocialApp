from django.apps import apps as django_apps
from django.conf import settings
from django.contrib.contenttypes.models import ContentType

from user.banned_users import get_banned
from content.models import Post, Comment


def get_community_model():
    """
    Return the Community model that is active in this project.
    """
    return django_apps.get_model(settings.COMMUNITY_MODEL, require_ready=False)

            

def cleaned_posts(request, posts):
    banned_profiles = get_banned(request)
    banned_user_ids = banned_profiles.values_list('id', flat=True)

    # Get banned posts authored by banned users
    user_content_type = ContentType.objects.get_for_model(request.user)
    banned_posts = Post.objects.filter(
        author_content_type=user_content_type,
        author_object_id__in=banned_user_ids
    ).values_list('id', flat=True)

    # Exclude banned posts from the given queryset
    return posts.exclude(id__in=banned_posts)

def cleared_comments(request, comments):
    banned_profiles = get_banned(request)
    banned_user_ids = banned_profiles.values_list('id', flat=True)
    banned_comments = Comment.objects.filter(id__in=banned_user_ids).values_list('id', flat=True)
    return comments.exclude(id__in=banned_comments)