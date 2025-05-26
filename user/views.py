from dj_rest_auth.registration.views import RegisterView
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from dj_rest_auth.views import LoginView
from rest_framework.authtoken.models import Token

from user.models import User
from user.serializers import (
    AuthentificationSerializer,
    UserSerializer,
    RegisterUserSerializer,
)


class RegularUserList(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserRegisterView(RegisterView):
    serializer_class = RegisterUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class AuthentificationView(LoginView):
    serializer_class = AuthentificationSerializer

    def post(self, request, *args, **kwargs):
        serializer = AuthentificationSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        self.user = get_object_or_404(
            User, username=serializer.validated_data["username"]
        )

        token, created = Token.objects.get_or_create(user=self.user)
        return Response(
            {
                "key": token.key,
                "id": self.user.id,
                "username": self.user.username,
                "role": self.user.role,
            },
            status=status.HTTP_200_OK,
        )
