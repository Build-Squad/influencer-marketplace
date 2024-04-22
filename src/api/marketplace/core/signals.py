# From the configuration model, whenever the key "priority_fees" is updated, I want to run a function
# that will update the priority fees in the database.

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Configuration
from .services import update_priority_fees


@receiver(post_save, sender=Configuration)
def post_save_update_priority_fees(sender, instance, created, **kwargs):
    print("hello")
    if instance.key == "platform_fees" and not created:
        update_priority_fees()
