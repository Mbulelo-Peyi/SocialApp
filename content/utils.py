from django.apps import apps as django_apps
from django.conf import settings


def get_community_model():
    """
    Return the Community model that is active in this project.
    """
    return django_apps.get_model(settings.COMMUNITY_MODEL, require_ready=False)

            