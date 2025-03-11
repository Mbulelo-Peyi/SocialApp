from django.urls import path, include
from . import views
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'profile', views.ProfileViewSet, basename='profile')
router.register(r'community', views.CommunityViewSet, basename='community')
router.register(r'chatrooms', views.ChatRoomListDetailViewSet, basename='chatrooms')
router.register(r'message', views.MessageViewSet, basename='message')

urlpatterns = [
    path('api/', include(router.urls), name='api'),
    path('api/used-emails/', views.UsedEmailsView.as_view(), name='used-emails'),
    path('api/common-password/', views.CommonPasswordsView.as_view(), name='common-password'),
    path('api/numeric-password/', views.NumericPasswordValidator.as_view(), name='numeric-password'),
    path('api/secure-password/', views.UserAttributeSimilarityValidator.as_view(), name='secure-password'),
    path('api/followers/', views.FollowersListView.as_view(), name='followers'),
    path('api/friends/', views.FriendsListView.as_view(), name='friends'),
    path('api/events/', views.EventListView.as_view(), name='events'),
    path('api/chat/<int:room_id>/', views.ChatRoomView.as_view(), name='chat'),
    path('api/last-chat/<id>/', views.LastMessageAPIView.as_view(), name='last-chat'),
    path('api/faq/', views.FrequentlyAskedQuestionView.as_view(), name='faq'),
    path('api/complaint/', views.CreateComplaintView.as_view(), name='complaint'),
]