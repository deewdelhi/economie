from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

from user.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password", "description", "rating", "role",
                  "date_joined", "date_of_birth")


class RegisterUserSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    description = serializers.CharField(required=False)
    date_of_birth = serializers.DateField(required=True)

    def custom_signup(self, request, user):
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.description = self.validated_data.get('description', '')
        user.date_of_birth = self.validated_data.get('date_of_birth', '')
        user.save()