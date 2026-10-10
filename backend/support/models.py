from django.conf import settings
from django.db import models
from accounts.models import Workspace


class KnowledgeArticle(models.Model):
    TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('website', 'Website'),
        ('text', 'Text'),
    ]
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('processed', 'Processed'),
        ('failed', 'Failed'),
    ]

    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name='articles'
    )
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    source_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='text')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processed')
    size_label = models.CharField(max_length=50, blank=True, default='')
    pages = models.PositiveIntegerField(null=True, blank=True)
    source_url = models.URLField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Conversation(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('escalated', 'Escalated'),
        ('closed', 'Closed'),
    ]

    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name='conversations'
    )
    customer_name = models.CharField(max_length=255, default='Guest')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f'Conversation {self.id} ({self.customer_name})'


class Message(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('ai', 'AI'),
        ('system', 'System'),
        ('agent', 'Agent'),
    ]

    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name='messages'
    )
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES)
    content = models.TextField()
    confidence = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.sender}: {self.content[:40]}'


class Ticket(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]

    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name='tickets'
    )
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets',
    )
    ticket_number = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=255)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    assigned_to = models.CharField(max_length=255, blank=True, default='Unassigned')
    ai_analysis = models.TextField(blank=True, default='')
    suggested_response = models.TextField(blank=True, default='')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_tickets',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        creating = self.pk is None
        super().save(*args, **kwargs)
        if creating and not self.ticket_number:
            self.ticket_number = f'#{1000 + self.pk}'
            super().save(update_fields=['ticket_number'])

    def __str__(self):
        return f'{self.ticket_number} {self.subject}'
