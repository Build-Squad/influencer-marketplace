from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from celery.schedules import crontab

from decouple import config

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "marketplace.settings")

app = Celery("marketplace")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.conf.ONCE = {
    'backend': 'celery_once.backends.Redis',
    'settings': {
        'url': config('CELERY_BROKER_URL'),
        'default_timeout': 60 * 60
    }
}

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


app.conf.beat_schedule = {
    # Update access token every 2 hour
    "update-access-tokens": {
        "task": "accounts.tasks.updateAccessTokens",
        "schedule": crontab(minute="0", hour="*/2"),
    },
    "schedule-reminder-notification": {
        "task": "orders.tasks.schedule_reminder_notification",
        "schedule": crontab(minute="*/10"),
    },
    "generate-metrics": {
        "task": "orders.tasks.store_order_item_metrics",
        "schedule": crontab(minute="0", hour="*/2"),
    }
}
