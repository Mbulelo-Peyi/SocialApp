from django.contrib import admin
from user.models import Profile, ProfilePicture, Community, CommunityRole,Friendship,MembershipRequest,BannedUser,Follower,Event

admin.site.register(Profile)
admin.site.register(ProfilePicture)
admin.site.register(Community)
admin.site.register(CommunityRole)
admin.site.register(Friendship)
admin.site.register(MembershipRequest)
admin.site.register(BannedUser)
admin.site.register(Follower)
admin.site.register(Event)
# Register your models here.
