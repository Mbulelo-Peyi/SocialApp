from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, AbstractUser, PermissionsMixin
import datetime
from django.utils.timezone import localdate
from django.contrib import auth
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey 
from django_countries.fields import CountryField
from django.core import signing
import random

from user.managers import MembershipRequestManager

sexes=(
    ('1', 'Male'),
    ('0','Female'),
    ('2','Other'),
)

class ProfileManager(BaseUserManager):
    def create_user(self,email,username,birthday,sex, password=None):
        if not email:
            raise ValueError('Please enter an email address')
        if not username:
            raise ValueError('Please enter a username')
        if not birthday:
            raise ValueError('Please enter you date of birth')
        if not sex:
            raise ValueError('Please enter you gender')
        
        user = self.model(
            email=self.normalize_email(email),
            username =username,
            birthday = birthday,
            sex = sex,
            )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,email,username, password, birthday, sex):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            username =username,
            birthday = birthday,
            sex = sex,
            
            )

        user.is_admin= True
        user.is_staff= True
        user.is_superuser= True
        user.save(using=self._db)
        
    def with_perm(
        self, perm, is_active=True, include_superusers=True, backend=None, obj=None
    ):
        if backend is None:
            backends = auth._get_backends(return_tuples=True)
            if len(backends) == 1:
                backend, _ = backends[0]
            else:
                raise ValueError(
                    "You have multiple authentication backends configured and "
                    "therefore must provide the `backend` argument."
                )
        elif not isinstance(backend, str):
            raise TypeError(
                "backend must be a dotted import path string (got %r)." % backend
            )
        else:
            backend = auth.load_backend(backend)
        if hasattr(backend, "with_perm"):
            return backend.with_perm(
                perm,
                is_active=is_active,
                include_superusers=include_superusers,
                obj=obj,
            )
        return self.none()

def profile_picture_directory_path(instance, filename):
    return 'profile_pictures/{}/{}/{}'.format(instance.user.id, instance.user.username, filename)

class ProfilePicture(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile_pictures",  # Add reverse relation for easier querying
        default=1
    )
    picture = models.ImageField(
        _('Avatar'),
        default='default.jpg',
        upload_to=profile_picture_directory_path
    )
    is_active = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Track upload time

    def __str__(self):
        return f"Profile Picture of {self.user.username} ({'Active' if self.is_active else 'Inactive'})"

    class Meta:
        verbose_name = _('Profile Picture')
        verbose_name_plural = _('Profile Pictures')
        ordering = ['-uploaded_at']  # Order by most recent upload

    def set_active(self):
        """
        Mark this picture as active and deactivate others for the same user.
        """
        self.user.profile_pictures.update(is_active=False)
        self.is_active = True
        self.save()


class Profile(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(verbose_name='email', max_length=60,unique=True)
    username = models.CharField('Username',max_length=30, unique=True)
    profile_pic = models.ManyToManyField(ProfilePicture, blank=True)
    date_joined = models.DateTimeField(verbose_name='date_joined',auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last_login',auto_now_add=True)
    is_admin = models.BooleanField('Is administrator',default=False)
    is_active = models.BooleanField('Is active',default=True)
    is_staff = models.BooleanField('Is staff',default=False)
    is_superuser = models.BooleanField('Is superuser',default=False)
    image = models.ImageField(_('Avatar'), default='default.jpg', upload_to='profile_pics')
    birthday = models.DateField(_('Birthday'),)
    sex = models.CharField(_('Gender'),max_length=16, choices=sexes)
    bio = models.TextField(_('Bio'), blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    country = CountryField(blank=True)
    region = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    device = models.CharField(max_length=30, blank=True)
    browser = models.CharField(max_length=30, blank=True)
    browser_version = models.CharField(max_length=30, blank=True)
    system = models.CharField(max_length=30, blank=True)
    

    USERNAME_FIELD='email'
    REQUIRED_FIELDS= ['username','birthday','sex']
    objects=ProfileManager()
    


    def __str__(self):
        return  self.username

    @property
    def age(self):
        return round((datetime.date.today() - self.birthday)//datetime.timedelta(days=365))

class Follower(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='followers')
    followed_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='following')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} follows {self.followed_user}"

class Friendship(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friendship_sender')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friendship_receiver')
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} and {self.receiver} are friends" if self.is_active  else f"{self.sender} requested {self.receiver}'s friendship"

class Community(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to="community_logos/", blank=True, null=True)
    cover_image = models.ImageField(upload_to="community_covers/", blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owned_communities")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="communities", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_private = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class ChatRoom(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, blank=True, null=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="chat_rooms")
    is_group = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name if self.name else f"ChatRoom {self.id}"

class MediaMessage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    media_file = models.FileField(upload_to="chat_media/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Media for Message {self.message.id}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='message_sender')
    content = models.TextField()
    media = models.ForeignKey(MediaMessage, on_delete=models.CASCADE, related_name="message_media")
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="read_messages", blank=True)
    delivered = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver}"
  
class MembershipRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'), 
        ('Approved','Approved'), 
        ('Declined', 'Declined'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    sender_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='request_sender',
        verbose_name=_('sender content type')
    )
    sender_object_id = models.CharField(_('sender object id'), max_length=255)
    sender = GenericForeignKey('sender_content_type', 'sender_object_id')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    objects = models.Manager()
    requests = MembershipRequestManager()

class CommunityRole(models.Model):
    ROLE_CHOICES = [
        ('Member', 'Member'),
        ('Moderator', 'Moderator'),
        ('Admin', 'Admin'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Member')

class CommunityRule(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name="rules")
    text = models.TextField()

class Event(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

class BannedUser(models.Model):
    slug = models.SlugField(unique=True, max_length=255, blank=True, editable=False)
    acting_user = models.ForeignKey(Profile, verbose_name=_('User'), on_delete=models.CASCADE, related_name='ban_acting_user')
    receiving_user = models.ForeignKey(Profile, verbose_name=_('User'), on_delete=models.CASCADE, related_name='ban_receiving_user')
    time = models.DateTimeField(_('Time'),auto_now_add=True)

    def __str__(self):
        return '{}-{}'.format(self.acting_user, self.receiving_user)


    def save(self, *args, **kwargs):
        if self.slug != "":
            pass
        else:
            self.slug = signing.dumps({'id': random.SystemRandom.random(self.id)})
            self.slug = self.slug.replace(":","-")
        super().save(*args, **kwargs)