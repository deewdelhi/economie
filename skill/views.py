from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets

from event.models import Event
from event.serializers import EventSerializer
from user.models import User
from user.serializers import UserSerializer
from .models import Skill
from .serializers import SkillSerializer


class UserSkillsWithEvents(APIView):
    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            skills = user.skills.all()

            for skill in skills:
                events = Event.objects.filter(skills=skill)
                serialized_events = EventSerializer(events, many=True).data
            return Response(serialized_events, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class SkillsView(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
