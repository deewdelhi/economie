from rest_framework import serializers

from event.models import Event
from user.serializers import UserSerializer


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'starting_date', 'ending_date', 'creator', 'capacity', 'location']
