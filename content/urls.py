from django.urls import path, include
from . import views
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'post', views.PostViewSet, basename='post')
router.register(r'posts', views.PostListDetailViewSet, basename='posts')
router.register(r'comment', views.CommentViewSet, basename='comment')
router.register(r'comments', views.CommentListDetailViewSet, basename='comments')
router.register(r'comment-reply', views.CommentReplyViewSet, basename='comment-reply')
router.register(r'comment-replys', views.CommentReplyListDetailViewSet, basename='comment-replys')

urlpatterns = [
    path('api/', include(router.urls), name='api'),
    path('api/feed/', views.UserPostFeedView.as_view(), name='feed'),

]