import requests
import json

S = requests.Session()

URL = "https://en.wikipedia.org/w/api.php"

def get_wiki_link(title):
    PARAMS = {
        "action": "opensearch",
        "namespace": "0",
        "search": title,
        "limit": "5",
        "format": "json"
    }

    R = S.get(url=URL, params=PARAMS)
    DATA = R.json()
    link = DATA
    return link
