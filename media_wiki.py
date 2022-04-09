"""Used to interact with Wikimedia API"""
import requests

S = requests.Session()

URL = "https://en.wikipedia.org/w/api.php"

def get_wiki_link(title):
    """Get wikipedia link for given movie title"""
    parameters = {
        "action": "opensearch",
        "namespace": "0",
        "search": title,
        "limit": "5",
        "format": "json"
    }

    response = S.get(url=URL, params=parameters)
    response_data = response.json()
    link = response_data
    return link
