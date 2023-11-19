from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db.models import SET_NULL
from django.conf import settings

class Package(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Package', default=uuid.uuid4, editable=False)
    influencer_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_by_user', on_delete=SET_NULL, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    # price = 
    # currency_id = 
    # status =
    # publish_date = 
