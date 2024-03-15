# core/twitter_api.py

import requests
from decouple import config


def get_twitter_usage():
    url = "https://api.twitter.com/2/usage/tweets"
    headers = {"Authorization": f"Bearer {config('TWITTER_BEARER_TOKEN')}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()
