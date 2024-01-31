from decouple import config

TWITTER_SCOPES = [
    "offline.access",
    "tweet.read",
    "tweet.write",
    "users.read",
    "follows.read",
    "follows.write",
    "mute.read",
]
TWITTER_CALLBACK_URL = f"{config('SERVER')}twitter-login-callback"
