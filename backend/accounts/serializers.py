from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Workspace

User = get_user_model()

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    workspace = WorkspaceSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'workspace']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    workspace_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'first_name', 'last_name', 'workspace_name']

    def create(self, validated_data):
        workspace_name = validated_data.pop('workspace_name', 'Default Workspace')
        workspace, created = Workspace.objects.get_or_create(name=workspace_name)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            workspace=workspace
        )

        # Seed starter KB for brand-new workspaces so the AI demo works immediately
        if created or not workspace.articles.exists():
            from support.management.commands.seed_demo import DEMO_ARTICLES
            from support.models import KnowledgeArticle

            for item in DEMO_ARTICLES:
                KnowledgeArticle.objects.get_or_create(
                    workspace=workspace,
                    title=item['title'],
                    defaults={
                        'content': item['content'],
                        'source_type': item['source_type'],
                        'status': 'processed',
                        'size_label': item.get('size_label', ''),
                        'pages': item.get('pages'),
                        'source_url': item.get('source_url', ''),
                    },
                )
        return user
