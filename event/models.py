from django.db import models
from preference.models import Preference
from skill.models import Skill

class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    starting_date = models.DateTimeField(auto_now_add=False)
    ending_date = models.DateTimeField(auto_now=False)
    creator = models.ForeignKey('user.User', on_delete=models.CASCADE)
    capacity = models.IntegerField()
    location = models.CharField(max_length=100)
    preferences = models.ManyToManyField(Preference, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    rating = models.FloatField(default=0)
    rated_by = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        app_label = 'event'