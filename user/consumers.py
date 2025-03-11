from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        self.channel_layer = get_channel_layer()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get('message', '')

        # Check if user exists
        chatroom = await self.get_chatroom(self.scope['url_route']['kwargs']['room_id'])
        sender = await self.get_user(data.get('username', ''))
        message = await self.create_message(chatroom,sender,message_text)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )

    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
        }))

    @sync_to_async
    def get_chatroom(self, room_id):
        """Fetch the chatroom from the database."""
        from user.models import ChatRoom
        try:
            return ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return None

    @sync_to_async
    def get_user(self, user_id):
        """Fetch the authenticated user."""
        User = get_user_model() 
        user = User.objects.filter(id=user_id).first()
        return user if User.objects.filter(id=user_id).exists() else "Anonymous"

    @sync_to_async
    def create_message(self, chatroom ,sender, content):
        """Save a message instance in the database."""
        from user.models import Message  
        from user.serializers import MessageSerializer  
        message = Message.objects.create(room=chatroom, sender=sender, content=content)
        message.save()
        serializer = MessageSerializer(message, many=False)
        return serializer.data

