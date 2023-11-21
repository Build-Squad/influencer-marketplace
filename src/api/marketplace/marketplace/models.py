from django.db import models

class Users(models.Model):
    id = models.CharField(max_length=30, primary_key=True)
    name = models.CharField(max_length=255)
    userName = models.CharField(max_length=255)
    accessToken = models.CharField(max_length=255)
