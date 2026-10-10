from django.db import models
from django.contrib.auth.models import AbstractUser

class Workspace(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    email = models.EmailField(unique=True)
    workspace = models.ForeignKey(Workspace, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
