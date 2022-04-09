"""Interacts with Recommendation API, gets recommendations based off current users favorites."""
import os
from typing import List

import requests
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

TASTEDIVE_API_KEY = os.getenv('TASTEDIVE_API_KEY')
BASE_URL = 'https://tastedive.com/api/similar'

def movie_query_builder(favorite_movies_title: List[str]):
    """convert list of movies into the query format necessary for the api call"""
    return ','.join(f'movie:{movie_title}' for movie_title in favorite_movies_title)


def get_movie_recommendations(favorite_movies_title: List[str], result_limit: int = 10):
    """based of a list of favorite movie titles, get recommendations based off those movies"""
    params = {
     'q':   movie_query_builder(favorite_movies_title),
     'type': 'movie',
     'info': 1,
     'limit': result_limit,
    }
    api_key = os.getenv('TASTEDIVE_API_KEY')
    if api_key is not None:
        params['k'] = api_key
    response = requests.get(BASE_URL,params)
    response_json = response.json()
    try:
        return response_json['Similar']['Results']
    except KeyError:
        return []
