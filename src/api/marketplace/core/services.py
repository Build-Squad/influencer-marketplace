# core/twitter_api.py

import requests
from decouple import config
from packages.models import Service
from .models import Configuration

def get_twitter_usage():
    url = "https://api.twitter.com/2/usage/tweets"
    headers = {"Authorization": f"Bearer {config('TWITTER_BEARER_TOKEN')}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


def update_priority_fees():
    services = Service.objects.all()
    current_platform_fees = int(
        Configuration.objects.get(key="platform_fees").value)
    services.update(platform_fees=current_platform_fees)
