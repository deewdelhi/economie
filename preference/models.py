from django.db import models

class Preference(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        app_label = 'preference'
