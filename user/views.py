from django.shortcuts import render
from rest_framework import generics, viewsets

from user.models import User
from user.serializers import UserSerializer


class RegularUserList(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
