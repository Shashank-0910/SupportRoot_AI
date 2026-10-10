
from django.db import transaction
from django.db.models import Q

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai import answer_from_knowledge
from .models import KnowledgeArticle, Conversation, Message, Ticket
from .serializers import (
    KnowledgeArticleSerializer,
    ConversationSerializer,
    ChatRequestSerializer,
    TicketSerializer,
    TicketCreateSerializer,
)


def get_workspace(user):
    return getattr(user, "workspace", None)


class WorkspaceScopedMixin:
    permission_classes = [IsAuthenticated]

    def get_workspace_or_error(self):
        workspace = get_workspace(self.request.user)

        if not workspace:
            return None, Response(
                {"detail": "No workspace associated with this account."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return workspace, None


class KnowledgeArticleViewSet(
    WorkspaceScopedMixin, viewsets.ModelViewSet
):
    serializer_class = KnowledgeArticleSerializer
    http_method_names = [
        "get", "post", "patch", "delete", "head", "options"
    ]

    def get_queryset(self):
        workspace = get_workspace(self.request.user)

        if not workspace:
            return KnowledgeArticle.objects.none()

        return KnowledgeArticle.objects.filter(workspace=workspace)

    def create(self, request, *args, **kwargs):
        workspace, error = self.get_workspace_or_error()
        if error:
            return error

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        source_type = data.get("source_type", "text")
        title = data.get("title", "Untitled")
        content = data.get("content", "")
        size_label = data.get("size_label") or (
            f"{max(1, len(content) // 1024)} KB"
            if content else "—"
        )

        article = KnowledgeArticle.objects.create(
            workspace=workspace,
            title=title,
            content=content,
            source_type=source_type,
            status="processing"
            if source_type in ("pdf", "website")
            else "processed",
            size_label=size_label,
            pages=data.get("pages"),
            source_url=data.get("source_url", ""),
        )

        # Demo processing only. Real PDF and website extraction
        # should be implemented separately.
        if article.status == "processing":
            if content:
                article.status = "processed"
            else:
                article.content = (
                    f"Content extraction is pending for {title}. "
                    "Upload extracted text to enable useful AI answers."
                )
                article.status = "processing"

            article.save(
                update_fields=["content", "status", "updated_at"]
            )

        return Response(
            KnowledgeArticleSerializer(article).data,
            status=status.HTTP_201_CREATED,
        )


class ConversationViewSet(
    WorkspaceScopedMixin, viewsets.ReadOnlyModelViewSet
):
    serializer_class = ConversationSerializer

    def get_queryset(self):
        workspace = get_workspace(self.request.user)

        if not workspace:
            return Conversation.objects.none()

        return (
            Conversation.objects
            .filter(workspace=workspace)
            .prefetch_related("messages")
        )

    @action(detail=False, methods=["post"], url_path="start")
    def start(self, request):
        workspace, error = self.get_workspace_or_error()
        if error:
            return error

        name = (
            request.data.get("customer_name")
            or request.user.first_name
            or request.user.username
            or "You"
        )

        with transaction.atomic():
            conversation = Conversation.objects.create(
                workspace=workspace,
                customer_name=name,
            )

            Message.objects.create(
                conversation=conversation,
                sender="ai",
                content=(
                    "Hello! I'm your CloudForge AI support assistant. "
                    "I can answer questions using your company's "
                    "knowledge base. How can I help?"
                ),
            )

        return Response(
            ConversationSerializer(conversation).data,
            status=status.HTTP_201_CREATED,
        )


class ChatView(WorkspaceScopedMixin, APIView):
    """POST /api/support/chat/ — send a message and receive an AI reply."""

    def post(self, request):
        workspace, error = self.get_workspace_or_error()
        if error:
            return error

        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data["message"].strip()
        conversation_id = serializer.validated_data.get(
            "conversation_id"
        )

        if not text:
            return Response(
                {"detail": "Message cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if conversation_id:
            conversation = Conversation.objects.filter(
                id=conversation_id,
                workspace=workspace,
            ).first()

            if not conversation:
                return Response(
                    {"detail": "Conversation not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            conversation = None

        # Persist the conversation and user message.
        with transaction.atomic():
            if conversation is None:
                conversation = Conversation.objects.create(
                    workspace=workspace,
                    customer_name=(
                        request.user.first_name
                        or request.user.username
                        or "You"
                    ),
                )

                Message.objects.create(
                    conversation=conversation,
                    sender="ai",
                    content=(
                        "Hello! I'm your CloudForge AI support assistant. "
                        "I can answer questions using your company's "
                        "knowledge base. How can I help?"
                    ),
                )

            user_message = Message.objects.create(
                conversation=conversation,
                sender="user",
                content=text,
            )

        # Retrieve only articles belonging to this workspace.
        articles = KnowledgeArticle.objects.filter(
            workspace=workspace,
            status="processed",
        )

        try:
            result = answer_from_knowledge(text, articles)

            if not isinstance(result, dict):
                raise ValueError("AI service returned an invalid response.")

            answer = result.get("answer")
            if not isinstance(answer, str) or not answer.strip():
                raise ValueError("AI service returned an empty answer.")

            confidence = float(result.get("confidence", 0.0))
            confidence = max(0.0, min(1.0, confidence))

        except Exception:
            # Log the actual exception in production rather than
            # exposing internal details to API clients.
            return Response(
                {
                    "detail": (
                        "The AI service is temporarily unavailable. "
                        "Your message was saved; please try again."
                    ),
                    "conversation_id": conversation.id,
                    "user_message_id": user_message.id,
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        with transaction.atomic():
            ai_message = Message.objects.create(
                conversation=conversation,
                sender="ai",
                content=answer,
                confidence=confidence,
            )

            system_message = None

            if confidence < 0.5:
                system_message = Message.objects.create(
                    conversation=conversation,
                    sender="system",
                    content=(
                        "AI confidence is low for this query. "
                        "Consider escalating to a human agent "
                        "or creating a support ticket."
                    ),
                )

            conversation.save(update_fields=["updated_at"])

        return Response(
            {
                "conversation_id": conversation.id,
                "user_message": {
                    "id": user_message.id,
                    "content": user_message.content,
                },
                "ai_message": {
                    "id": ai_message.id,
                    "content": ai_message.content,
                    "confidence": ai_message.confidence,
                    "source": result.get("source"),
                },
                "system_message": (
                    {
                        "id": system_message.id,
                        "content": system_message.content,
                    }
                    if system_message else None
                ),
            },
            status=status.HTTP_200_OK,
        )


class TicketViewSet(WorkspaceScopedMixin, viewsets.ModelViewSet):
    http_method_names = [
        "get", "post", "patch", "head", "options"
    ]

    def get_queryset(self):
        workspace = get_workspace(self.request.user)

        if not workspace:
            return Ticket.objects.none()

        queryset = Ticket.objects.filter(workspace=workspace)

        status_filter = self.request.query_params.get("status")
        if status_filter and status_filter != "all":
            queryset = queryset.filter(status=status_filter)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(subject__icontains=search)
                | Q(customer_name__icontains=search)
            )

        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return TicketCreateSerializer
        return TicketSerializer

    def create(self, request, *args, **kwargs):
        workspace, error = self.get_workspace_or_error()
        if error:
            return error

        serializer = TicketCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        # Confirm the serializer assigns the ticket to this workspace.
        ticket = serializer.save()

        if ticket.workspace_id != workspace.id:
            ticket.delete()
            return Response(
                {"detail": "Invalid workspace for this ticket."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            TicketSerializer(ticket).data,
            status=status.HTTP_201_CREATED,
        )

    def partial_update(self, request, *args, **kwargs):
        ticket = self.get_object()

        allowed_fields = {
            "status", "priority", "assigned_to", "description"
        }
        data = {
            key: value
            for key, value in request.data.items()
            if key in allowed_fields
        }

        if not data:
            return Response(
                {"detail": "No supported fields were provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = TicketSerializer(
            ticket,
            data=data,
            partial=True,
            context=self.get_serializer_context(),
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)