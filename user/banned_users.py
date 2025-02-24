from .models import Profile, BannedUser

def get_banned(request):
    banned_ids = BannedUser.objects.filter(acting_user=request.user).values_list('receiving_user_id', flat=True)
    return Profile.objects.filter(id__in=banned_ids)


def get_cleared(request, data:Profile):
    banned_profiles = get_banned(request)
    banned_user_ids = banned_profiles.values_list('id', flat=True)
    data.exclude(id=request.user.id)
    return data.exclude(id__in=banned_user_ids)


