from django.contrib import admin
from user.models import Profile, ProfilePicture, Community, CommunityRole,Friendship,MembershipRequest,BannedUser,Follower

admin.site.register(Profile)
admin.site.register(ProfilePicture)
admin.site.register(Community)
admin.site.register(CommunityRole)
admin.site.register(Friendship)
admin.site.register(MembershipRequest)
admin.site.register(BannedUser)
admin.site.register(Follower)
# Register your models here.
