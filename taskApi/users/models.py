from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):    
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'       # login with email, not username
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email