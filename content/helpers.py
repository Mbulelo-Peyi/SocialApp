from django.contrib.auth import get_user_model

from content.serializers import PostFileSerializer
from content.models import Tag
Profile = get_user_model()



def add_user(request, serializer):
        serializer.initial_data['user'] = request.user
        return serializer

def create_media(request, media_files:list):
    file_list = []
    for media in media_files:
        serializer = PostFileSerializer(data=media, context={'request': request})
        serializer = add_user(request, serializer)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            file_list.append(serializer.instance)
    return file_list

def get_tags(tags:list):
    tag_list = []
    for tag in tags:
        try:
            user = Profile.objects.get(id=tag['id'])
            tag_list.append(user)
        except Exception as e:
            raise e
    return tag_list

def get_hashtags(tags:list):
    tag_list = []
    for tag in tags:
        try:
            hashtag = Tag.objects.get(id=tag['id'])
            tag_list.append(hashtag)
        except Exception as e:
            raise e
    return tag_list
