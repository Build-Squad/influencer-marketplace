from django.db.models.signals import post_save
from django.dispatch import receiver

from .services import create_signup_notification
from .models import User


@receiver(post_save, sender=User)
def post_save_create_notification(sender, instance, created, **kwargs):
    if created:
        create_signup_notification(user=instance)
