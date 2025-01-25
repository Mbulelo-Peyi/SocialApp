from django.db.models.signals import post_save
from django.dispatch import receiver

from opennsfw2 import predict_image, predict_video_frames
from transformers import TFRobertaForSequenceClassification, RobertaTokenizer
import tensorflow as tf

from content.models import PostFile, Post, Comment, CommentReply


@receiver(post_save, sender=PostFile)
def create_post_file(sender, instance, created, **kwargs):
    if created:
        rated = PostFile.objects.filter(id=instance.id)
        media_file = instance.media_file
        file_name = media_file.name
        file_extension = file_name.split('.')[-1].lower()
        if file_extension in ["jpeg", "jpg", "png"]:
            results = predict_image(instance.media_file) 
            if results > 0.5:
                rated.update(blur=True)
        elif file_extension in ["mp4", "mov", "mkv"]:
            print(instance.media_file)
            print(instance.media_file.path)
            print(instance.media_file.url)
            _,results = predict_video_frames(instance.media_file.path) 
            for frame in results:
                if frame > 0.5:
                    rated.update(blur=True)


@receiver(post_save, sender=Post)
def create_post(sender, instance, **kwargs):
    content = instance.content
    post = Post.objects.filter(id=instance.id)
    model_name = "roberta-base-openai-detector"
    tokenizer = RobertaTokenizer.from_pretrained(model_name)
    model = TFRobertaForSequenceClassification.from_pretrained(model_name)

    inputs = tokenizer(content, return_tensors="tf")
    outputs = model(**inputs)
    logits = outputs.logits
    sentiment = tf.nn.softmax(logits)
    predicted_class = tf.argmax(sentiment, axis=1).numpy()[0]
    post.update(mood=predicted_class)

    
@receiver(post_save, sender=Comment)
def create_comment(sender, instance, **kwargs):
    content = instance.content
    comment = Comment.objects.filter(id=instance.id)
    model_name = "roberta-base-openai-detector"
    tokenizer = RobertaTokenizer.from_pretrained(model_name)
    model = TFRobertaForSequenceClassification.from_pretrained(model_name)

    inputs = tokenizer(content, return_tensors="tf")
    outputs = model(**inputs)
    logits = outputs.logits
    sentiment = tf.nn.softmax(logits)
    predicted_class = tf.argmax(sentiment, axis=1).numpy()[0]
    comment.update(mood=predicted_class)

@receiver(post_save, sender=CommentReply)
def create_comment_reply(sender, instance, **kwargs):
    content = instance.content
    comment_reply = CommentReply.objects.filter(id=instance.id)
    model_name = "roberta-base-openai-detector"
    tokenizer = RobertaTokenizer.from_pretrained(model_name)
    model = TFRobertaForSequenceClassification.from_pretrained(model_name)

    inputs = tokenizer(content, return_tensors="tf")
    outputs = model(**inputs)
    logits = outputs.logits
    sentiment = tf.nn.softmax(logits)
    predicted_class = tf.argmax(sentiment, axis=1).numpy()[0]
    comment_reply.update(mood=predicted_class)