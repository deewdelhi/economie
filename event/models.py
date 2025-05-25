from django.db import models

from user.models import User


class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    starting_date = models.DateTimeField(auto_now_add=False)
    ending_date = models.DateTimeField(auto_now=False)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    capacity = models.IntegerField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        app_label = 'event'