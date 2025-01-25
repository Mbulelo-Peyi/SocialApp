from rest_framework.permissions import BasePermission
from user.models import Profile, Community, CommunityRole

class CanUpdatePost(BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj.author, Profile):
            return obj.author == request.user
        elif isinstance(obj.author, Community):
            user_role = CommunityRole.objects.filter(community=obj.author, user=request.user).first()
            return user_role and user_role.role in ["Moderator", "Admin"]
        return False
