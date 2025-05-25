from rest_framework import serializers

from event.models import Event
from preference.models import Preference
from user.serializers import UserSerializer


class PreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = ['id', 'name']
