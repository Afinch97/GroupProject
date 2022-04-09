import os
import requests
from dotenv import load_dotenv, find_dotenv
from typing import List
from pprint import pprint

load_dotenv(find_dotenv())

TASTEDIVE_API_KEY = os.getenv('TASTEDIVE_API_KEY')
BASE_URL = 'https://tastedive.com/api/similar'

def movie_query_builder(favorite_movies_title: List[str]):
    return ','.join(f'movie:{movie_title}' for movie_title in favorite_movies_title)


def get_movie_recommendations(favorite_movies_title: List[str], result_limit: int = 5):
    params = {
     'q':   movie_query_builder(favorite_movies_title),
     'type': 'movie',
     'info': 1,
     'limit': result_limit
    }
    response = requests.get(BASE_URL,params)
    response_json = response.json()
    try:
        return response_json['Similar']['Results']
    except KeyError:
        return []

if __name__ == '__main__':
    movies = ['Pulp Fiction', 'Scream']
    pprint(get_movie_recommendations(movies))