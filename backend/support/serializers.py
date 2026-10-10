from rest_framework import serializers
from .models import KnowledgeArticle, Conversation, Message, Ticket


class KnowledgeArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeArticle
        fields = [
            'id',
            'title',
            'content',
            'source_type',
            'status',
            'size_label',
            'pages',
            'source_url',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'confidence', 'created_at']
        read_only_fields = fields


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id',
            'customer_name',
            'status',
            'created_at',
            'updated_at',
            'messages',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at', 'messages']


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000)
    conversation_id = serializers.IntegerField(required=False, allow_null=True)


class TicketSerializer(serializers.ModelSerializer):
    conversation_id = serializers.IntegerField(
        source='conversation.id', read_only=True, allow_null=True
    )

    class Meta:
        model = Ticket
        fields = [
            'id',
            'ticket_number',
            'subject',
            'customer_name',
            'customer_email',
            'description',
            'priority',
            'status',
            'assigned_to',
            'ai_analysis',
            'suggested_response',
            'conversation_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'ticket_number',
            'ai_analysis',
            'suggested_response',
            'conversation_id',
            'created_at',
            'updated_at',
        ]


class TicketCreateSerializer(serializers.ModelSerializer):
    conversation_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Ticket
        fields = [
            'subject',
            'customer_name',
            'customer_email',
            'description',
            'priority',
            'assigned_to',
            'conversation_id',
        ]

    def create(self, validated_data):
        conversation_id = validated_data.pop('conversation_id', None)
        request = self.context['request']
        workspace = request.user.workspace

        conversation = None
        if conversation_id:
            conversation = Conversation.objects.filter(
                id=conversation_id, workspace=workspace
            ).first()
            if conversation:
                conversation.status = 'escalated'
                conversation.save(update_fields=['status', 'updated_at'])

        subject = validated_data.get('subject', '')
        assigned = validated_data.pop('assigned_to', None) or (
            request.user.first_name or request.user.username or 'Unassigned'
        )
        ai_analysis = (
            'Escalated from AI assistant. Review the linked conversation and '
            'knowledge base for context before responding.'
        )
        suggested = (
            f'Hi {validated_data.get("customer_name", "there")}, thanks for reaching out '
            f'about "{subject}". We are looking into this and will update you shortly.'
        )

        return Ticket.objects.create(
            workspace=workspace,
            conversation=conversation,
            created_by=request.user,
            assigned_to=assigned,
            ai_analysis=ai_analysis,
            suggested_response=suggested,
            **validated_data,
        )
