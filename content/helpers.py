from django.contrib.auth import get_user_model

from content.serializers import PostFileSerializer
from content.models import Tag,PostFile
Profile = get_user_model()




def create_media(request, media_files:list):
    file_list = []
    if len(media_files) > 0:
        for media in media_files:
            post_file = PostFile.objects.create(
                user = request.user,
                media_file = media
            )
            post_file.save()
            file_list.append(post_file)
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


def get_relations(data):
    try:
        media_files = data.pop('media')
    except:
        media_files = []
    try:
        tags = data.pop('tags')
    except:
        tags = []
    try:
        hashtags = data.pop('hashtags')
    except:
        hashtags = []
    return media_files, tags, hashtags