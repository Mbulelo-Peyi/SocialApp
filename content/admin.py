from django.contrib import admin
from content.models import PostFile, Post, ViewedPost
# Register your models here.
admin.site.register(PostFile)
admin.site.register(Post)
admin.site.register(ViewedPost)