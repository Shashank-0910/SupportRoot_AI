
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    KnowledgeArticleViewSet,
    ConversationViewSet,
    ChatView,
    TicketViewSet,
)

router = DefaultRouter()

# Knowledge base APIs
router.register(
    r"articles",
    KnowledgeArticleViewSet,
    basename="articles",
)

# Conversation history and starting conversations
router.register(
    r"conversations",
    ConversationViewSet,
    basename="conversations",
)

# Support ticket management
router.register(
    r"tickets",
    TicketViewSet,
    basename="tickets",
)

urlpatterns = [
    # AI support chat
    path("chat/", ChatView.as_view(), name="chat"),

    # All router-based endpoints
    path("", include(router.urls)),
]