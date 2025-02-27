from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from djoser.email import PasswordChangedConfirmationEmail
from django_countries.serializer_fields import CountryField
from content.utils import get_community_model
from user.models import(
    ProfilePicture,
    Follower,
    Friendship,
    ChatRoom,
    MediaMessage,
    Message,
    Community,
    MembershipRequest,
    CommunityRole,
    CommunityRule,
    Event,
)

Profile = get_user_model()
Community = get_community_model()

class ProfilePictureSerializer(serializers.ModelSerializer):
    # user = ProfileSerializer(read_only=True)

    class Meta:
        model = ProfilePicture
        fields = ["id", "user", "picture", "is_active", "uploaded_at"]  # Explicit fields
        read_only_fields = ["id", "uploaded_at"]

    def to_representation(self, instance):
        request = self.context.get('request')
        data = super().to_representation(instance)
        if request:
            data["picture_url"] = request.build_absolute_uri(instance.picture.url) if instance.picture else None
        return data

class AdminProfileSerializer(serializers.ModelSerializer):
    country = CountryField(required=False)
    image = serializers.ImageField(required=False)
    profile_pic = ProfilePictureSerializer(required=False, many=True)
    class Meta:
        model = Profile
        fields = "__all__"
        extra_kwargs = {'password': {'write_only': True}}

class ProfileSerializer(serializers.ModelSerializer):
    country = CountryField(required=False)
    image = serializers.ImageField(required=False)
    profile_pic = ProfilePictureSerializer(required=False, many=True)
    class Meta:
        model = Profile
        fields = ['id','email', 'username', 'profile_pic', 'password', 'birthday', 'sex', 'image', 'country']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Profile.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        return user

class ProfileProcessingSerializer(serializers.ModelSerializer):
    country = CountryField(required=False)
    image = serializers.ImageField(required=False)
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    birthday = serializers.DateField(required=False)
    sex = serializers.CharField(required=False)
    class Meta:
        model = Profile
        fields = ['id','email', 'username', 'birthday', 'sex', 'address', 'postal_code', 'image', 'country']


class CustomPasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()

        #Send confirmation email
        context = {'user': user}
        to = [user.email]
        PasswordChangedConfirmationEmail(self.context['request'], context).send(to)
        PasswordChangedConfirmationEmail(self.context).send(to)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        serializer = ProfileSerializer(user)
        token['id'] = user.id
        token['email'] = user.email
        token['username'] = user.username
        token['birthday'] = serializer.data['birthday']
        token['sex'] = user.sex
        token['is_admin'] = user.is_admin
        # ...
        return token
    
class FollowerSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    followed_user = ProfileSerializer(read_only=True)

    class Meta:
        model = Follower
        fields = "__all__"

class FriendshipSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)
    receiver = ProfileSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = "__all__"

class CommunitySerializer(serializers.ModelSerializer):
    created_by = ProfileSerializer(read_only=True)
    members = ProfileSerializer(required=False, many=True)

    class Meta:
        model = Community
        fields = "__all__"
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["members_count"] = instance.members_count
        return data

class ChatRoomSerializer(serializers.ModelSerializer):
    community = CommunitySerializer(read_only=True)
    members = ProfileSerializer(required=False, many=True)

    class Meta:
        model = ChatRoom
        fields = "__all__"

class MediaMessageSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)

    class Meta:
        model = MediaMessage
        fields = "__all__"

class MessageSerializer(serializers.ModelSerializer):
    room = ChatRoomSerializer(read_only=True)
    sender = ProfileSerializer(read_only=True)

    class Meta:
        model = Message
        fields = "__all__"

class GenericAuthorRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value, Profile):
            serializer = ProfileSerializer(value)
        if isinstance(value, Community):
            serializer = CommunitySerializer(value)
        return serializer.data

class MembershipRequestSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    community = CommunitySerializer(read_only=True)
    sender = GenericAuthorRelatedField(read_only=True)

    class Meta:
        model = MembershipRequest
        fields = "__all__"

class CommunityRoleSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    community = CommunitySerializer(read_only=True)

    class Meta:
        model = CommunityRole
        fields = "__all__"

class CommunityRuleSerializer(serializers.ModelSerializer):
    community = CommunitySerializer(read_only=True)

    class Meta:
        model = CommunityRule
        fields = "__all__"

class EventSerializer(serializers.ModelSerializer):
    community = CommunitySerializer(read_only=True)
    attendees = ProfileSerializer(required=False, many=True)

    class Meta:
        model = Event
        fields = ["id", "community", "attendees", "title", "description", "venue", "date", "created_at", "timesince"]

