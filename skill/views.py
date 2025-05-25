from django.shortcuts import render
from rest_framework import viewsets

from skill.models import Skill
from skill.serializers import SkillSerializer


class SkillsView(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
