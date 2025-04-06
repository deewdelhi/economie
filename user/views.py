from dj_rest_auth.registration.views import RegisterView
from django.shortcuts import render
from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from user.models import User
from user.serializers import UserSerializer, RegisterUserSerializer


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
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

