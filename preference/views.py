from django.shortcuts import render
from rest_framework import viewsets

from preference.models import Preference
from preference.serializers import PreferenceSerializer


class PreferenceView(viewsets.ModelViewSet):
    queryset = Preference.objects.all()
    serializer_class = PreferenceSerializer
