import requests
import json


def send_tweet(access_code, text):

  url = "https://api.twitter.com/2/tweets"

  payload = json.dumps({
      "text": text,
  })
  headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_code,
  }

  response = requests.request("POST", url, headers=headers, data=payload)

  if response.status_code == 201:
    return True
  else:
    return False
