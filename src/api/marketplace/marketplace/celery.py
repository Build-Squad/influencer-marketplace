from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "marketplace.settings")

app = Celery("marketplace")

app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


app.conf.beat_schedule = {
    # Update access token every 2 hour
    "update-access-tokens": {
        "task": "accounts.tasks.updateAccessTokens",
        "schedule": crontab(hour="*/2"),
    },
}
