from django.db import models
from django.contrib.auth.models import AbstractUser

class MyCustomUser(AbstractUser):

    name = models.CharField(max_length=200, null=True, )    
    email = models.EmailField(max_length=100, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True) 