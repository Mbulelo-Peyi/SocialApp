from rest_framework import serializers
from django.contrib.auth import get_user_model
from django_countries.serializer_fields import CountryField
from content.utils import get_community_model
from content.models import(
    PostFile,
    Post,
    Tag,
    Reaction,
    Comment,
    CommentReply,
)
from user.serializers import ProfileSerializer, CommunitySerializer


Profile = get_user_model()
Community = get_community_model()



class PostFileSerializer(serializers.ModelSerializer):
    user  = ProfileSerializer(read_only=True)
    
    class Meta:
        model = PostFile
        fields = "__all__"

class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tag
        fields = "__all__"

class GenericAuthorRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value, Profile):
            serializer = ProfileSerializer(value)
            return serializer.data
        if isinstance(value, Community):
            serializer = CommunitySerializer(value)
            return serializer.data


class PostSerializer(serializers.ModelSerializer):
    author = GenericAuthorRelatedField(read_only=True)
    country = CountryField(required=False)
    media = PostFileSerializer(required=False, many=True)
    tags = ProfileSerializer(required=False, many=True)
    hashtags = TagSerializer(required=False, many=True)
    author_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = "__all__"

    def get_author_image_url(self, obj):
        request = self.context.get('request')
        if isinstance(obj.author, Profile):
            if obj.author.profile_pic.count() > 0:
                return request.build_absolute_uri(obj.author.profile_pic.filter(is_active=True).first().picture.url)
            else:
                return request.build_absolute_uri(obj.author.image.url)
        if isinstance(obj.author, Community):
            return request.build_absolute_uri(obj.author.cover_image.url)

class ReactionSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    user = ProfileSerializer(read_only=True)
    country = CountryField(required=False)

    class Meta:
        model = Reaction
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    user = ProfileSerializer(read_only=True)
    country = CountryField(required=False)
    like = ProfileSerializer(required=False, many=True)
    dislike = ProfileSerializer(required=False, many=True)

    class Meta:
        model = Comment
        fields = "__all__"

class CommentReplySerializer(serializers.ModelSerializer):
    comment = CommentSerializer(read_only=True)
    user = ProfileSerializer(read_only=True)
    like = ProfileSerializer(required=False, many=True)
    dislike = ProfileSerializer(required=False, many=True)

    class Meta:
        model = CommentReply
        fields = "__all__"

class CommentReplyPreocessingSerializer(serializers.ModelSerializer):
    like = ProfileSerializer(required=False, many=True)
    dislike = ProfileSerializer(required=False, many=True)

    class Meta:
        model = CommentReply
        fields = "__all__"