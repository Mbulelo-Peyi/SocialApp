from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey 
from django_countries.fields import CountryField

from content.managers import PostManager, ReactionManager, CommentManager

class PostFile(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    media_file = models.FileField(upload_to='post_media/')
    blur = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    TEXT = 'text'
    IMAGE = 'image'
    VIDEO = 'video'
    MOOD_TYPES = [
        ('0', 'NEGATIVE'),
        ('1','NEUTRAL'),
        ('2','POSITIVE'),
    ]
    POST_TYPES = [
        (TEXT, 'Text'),
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
    ]
    author_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='post_author',
        verbose_name=_('author content type')
    )
    author_object_id = models.CharField(_('author object id'), max_length=255)
    author = GenericForeignKey('author_content_type', 'author_object_id')
    content = models.TextField()
    mood = models.CharField(max_length=20, choices=MOOD_TYPES, default="2")
    media = models.ManyToManyField(PostFile, blank=True)
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default=TEXT)
    tags = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="tagged_users")
    hashtags = models.ManyToManyField(Tag, blank=True)
    scheduled_time = models.DateTimeField(blank=True, null=True)
    adult_rated = models.BooleanField(default=False)
    country = CountryField(blank=True)
    region = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    device = models.CharField(max_length=30, blank=True)
    browser = models.CharField(max_length=30, blank=True)
    browser_version = models.CharField(max_length=30, blank=True)
    system = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = models.Manager()
    posts = PostManager()


    '''
    {
        "author_object_id": "1",
        "author_content_type":"profile",
        "content": "This is a test",
        "adult_rated": false
    }
    '''

    def __str__(self):
        return f"{self.author} - {self.content[:10]}" 
    
    @property
    def is_scheduled(self):
        return True if self.scheduled_time is not None and self.scheduled_time > timezone.now() else False
    
    @property
    def author_model(self):
        return ContentType.objects.get_for_model(self.author_content_type)


class Reaction(models.Model):
    LIKE = 'like'
    LOVE = 'love'
    HAHA = 'haha'
    SAD = 'sad'
    ANGRY = 'angry'

    REACTION_TYPES = [
        (LIKE, 'Like'),
        (LOVE, 'Love'),
        (HAHA, 'Haha'),
        (SAD, 'Sad'),
        (ANGRY, 'Angry'),
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=10, choices=REACTION_TYPES, default=LIKE)
    country = CountryField(blank=True)
    region = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    device = models.CharField(max_length=30, blank=True)
    browser = models.CharField(max_length=30, blank=True)
    browser_version = models.CharField(max_length=30, blank=True)
    system = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()
    reactions = ReactionManager()


    def __str__(self):
        return f"{self.user.username} reacted with {self.reaction_type} to post {self.post.id}"

class Comment(models.Model):
    MOOD_TYPES = [
        ('0', 'NEGATIVE'),
        ('1','NEUTRAL'),
        ('2','POSITIVE'),
    ]
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    country = CountryField(blank=True)
    mood = models.CharField(max_length=20, choices=MOOD_TYPES, default="2")
    region = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    device = models.CharField(max_length=30, blank=True)
    browser = models.CharField(max_length=30, blank=True)
    browser_version = models.CharField(max_length=30, blank=True)
    system = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="comment_like", blank=True)
    dislike = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="comment_dislike", blank=True)
    objects = models.Manager()
    comments = CommentManager()

    def __str__(self):
        return f"{self.user.username} commented with {self.content[:30]} to post {self.post.id}"
    
    def total_likes(self):
        return self.like.all().count()
    
    def total_dislikes(self):
        return self.dislike.all().count()

class CommentReply(models.Model):
    MOOD_TYPES = [
        ('0', 'NEGATIVE'),
        ('1','NEUTRAL'),
        ('2','POSITIVE'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    content = models.TextField()
    mood = models.CharField(max_length=20, choices=MOOD_TYPES, default="2")
    created_at = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="reply_like", blank=True)
    dislike = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="reply_dislike", blank=True)

    def __str__(self):
        return f"{self.user.username} replied to {self.comment.content[:30]} with {self.content[:30]}"

    def total_likes(self):
        return self.like.all().count()
    
    def total_dislikes(self):
        return self.dislike.all().count()

class ViewedPost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    viewed_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

# Create your models here.
