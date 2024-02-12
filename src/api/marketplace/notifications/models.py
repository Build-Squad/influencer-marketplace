import uuid
from django.db import models
from django.db.models import SET_NULL
from accounts.models import User
# Create your models here.


class Notification(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name='Notification ID', default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    user = models.ForeignKey(
        User, related_name='notification_user_id', on_delete=SET_NULL, null=True
    )
    slug = models.CharField(max_length=255, blank=True, null=True)
    module = models.CharField(max_length=255, blank=True, null=True)
    module_id = models.UUIDField(blank=True, null=True)

    class Meta:
        db_table = "notification"

    def __str__(self):
        return self.title
