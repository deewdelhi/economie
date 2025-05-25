from django.db import models

from preference.models import Preference
from skill.models import Skill
from user.models import User


class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    starting_date = models.DateTimeField(auto_now_add=False)
    ending_date = models.DateTimeField(auto_now=False)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    capacity = models.IntegerField()
    location = models.CharField(max_length=100)
    preferences = models.ManyToManyField(Preference, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        app_label = 'event'