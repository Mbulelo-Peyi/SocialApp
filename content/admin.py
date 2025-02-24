from django.contrib import admin
from content.models import PostFile, Post, ViewedPost, Comment, Reaction
# Register your models here.
admin.site.register(PostFile)
admin.site.register(Post)
admin.site.register(Reaction)
admin.site.register(Comment)
admin.site.register(ViewedPost)