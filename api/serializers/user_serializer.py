from rest_framework import serializers
from ..models.user_model import MyCustomUser
from django.contrib.auth.hashers import make_password

class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyCustomUser
        fields = ('email', 'username', 'password')
 