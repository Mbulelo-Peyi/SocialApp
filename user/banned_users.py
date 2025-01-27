from .models import Profile, BannedUser

def get_banned(request):
    banned_ids = BannedUser.objects.filter(acting_user=request.user).values_list('receiving_user_id', flat=True)
    return Profile.objects.filter(id__in=banned_ids)


def get_cleared(request, data:Profile):
    banned_profiles = list(get_banned(request))
    cleared_profiles = []
    for i in data:
        if i not in banned_profiles and i not in cleared_profiles:
            cleared_profiles.append(i)
    cleared_ids = set([each.id for each in cleared_profiles])
    profiles = Profile.objects.filter(id__in=cleared_ids)
    return profiles

