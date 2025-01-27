from django.urls import path, include
from . import views
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'profile', views.ProfileViewSet, basename='profile')
router.register(r'community', views.CommunityViewSet, basename='community')
router.register(r'message', views.MessageViewSet, basename='message')

urlpatterns = [
    path('api/', include(router.urls), name='api'),
    path('api/used-emails/', views.UsedEmailsView.as_view(), name='used-emails'),
    path('api/common-password/', views.CommonPasswordsView.as_view(), name='common-password'),
    path('api/numeric-password/', views.NumericPasswordValidator.as_view(), name='numeric-password'),
    path('api/secure-password/', views.UserAttributeSimilarityValidator.as_view(), name='secure-password'),
]