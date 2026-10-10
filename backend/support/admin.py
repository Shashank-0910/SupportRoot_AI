from django.contrib import admin
from .models import KnowledgeArticle, Conversation, Message, Ticket


@admin.register(KnowledgeArticle)
class KnowledgeArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'source_type', 'status', 'workspace', 'created_at')
    list_filter = ('status', 'source_type')


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'status', 'workspace', 'updated_at')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'sender', 'confidence', 'created_at')


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        'ticket_number',
        'subject',
        'priority',
        'status',
        'workspace',
        'created_at',
    )
    list_filter = ('status', 'priority')
