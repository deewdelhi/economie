from rest_framework import serializers

from event.models import Event
from user.serializers import UserSerializer


class EventSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'starting_date', 'ending_date', 'creator',
                  'rating', 'capacity', 'location', 'preferences', 'skills']

    def get_rating(self, obj):
        # Calculate average rating safely
        if obj.rated_by and obj.rated_by > 0:
            return str(round(obj.rating / obj.rated_by, 2))
        return str(0.0)