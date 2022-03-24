import os
import requests
from dotenv import load_dotenv, find_dotenv
import MediaWiki
import json 
load_dotenv(find_dotenv())

BASE_URL = 'https://api.themoviedb.org/3/trending/movie/week?api_key='+ str(os.getenv('TMDB_KEY'))
POSTER_PATH = 'https://image.tmdb.org/t/p/w185'
POSTER_PATH_3='https://image.tmdb.org/t/p/w300'
GENRE_URL = 'https://api.themoviedb.org/3/genre/movie/list?api_key='+str(os.getenv('TMDB_Key'))+'&language=en-US'

def get_trending():
    response = requests.get(BASE_URL)
    data = response.json()
    movies = data['results']
    
    def get_title(movies):
        return movies['title']
    
    def get_poster(movies):
        return (POSTER_PATH +movies['poster_path'])
    
    def get_ov(movies):
        return movies['overview']
    
    def get_id(movies):
        return movies['id']
    
    def get_tagline(movies):
        TAG_URL = 'https://api.themoviedb.org/3/movie/'+ str(movies['id']) +'?api_key='+os.getenv('TMDB_KEY')+'&language=en-US'
        response2 = requests.get(TAG_URL)
        data2 =response2.json()
        tagline = data2['tagline']
        return tagline
    
    
    titles = map(get_title, movies)
    posters = map(get_poster, movies)
    overviews = map(get_ov, movies)
    ids = map(get_id, movies)
    taglines = map(get_tagline, movies)
    
    return {
        'titles': list(titles),
        'overviews': list(overviews),
        'posters': list(posters),
        'ids': list(ids),
        'taglines': list(taglines),
    }
    
#returns the available genres of movies
def get_genres():
    responses = requests.get(GENRE_URL)
    data = responses.json()
    genres = data
    
    def get_genre(genres):
        return genres
    
    names = map(get_genre,genres)
    
    return {
        'genres': list(names),

    }
    
def movie_search(query):
    SEARCH_URL= 'https://api.themoviedb.org/3/search/movie?api_key='+os.getenv('TMDB_KEY')+'&language=en-US&query='+ query +'&page=1&include_adult=false'
    
    response = requests.get(SEARCH_URL)
    data = response.json()
    movies = data['results']
    
    def get_title(movies):
        return movies['title']
    
    def get_poster(movies):
        if movies['poster_path'] == None:
            return None
        return (POSTER_PATH +movies['poster_path'])
    
    def get_ov(movies):
        return movies['overview']
    
    def get_id(movies):
        return movies['id']
    
    def get_tagline(movies):
        TAG_URL = 'https://api.themoviedb.org/3/movie/'+ str(movies['id']) +'?api_key='+os.getenv('TMDB_KEY')+'&language=en-US'
        response2 = requests.get(TAG_URL)
        data2 =response2.json()
        tagline = data2['tagline']
        return tagline
    
    
    titles = map(get_title, movies)
    posters = map(get_poster, movies)
    overviews = map(get_ov, movies)
    ids = map(get_id, movies)
    taglines = map(get_tagline, movies)
    
    return {
        'titles': list(titles),
        'overviews': list(overviews),
        'posters': list(posters),
        'ids': list(ids),
        'taglines': list(taglines),
    }

def movie_info(id):
    INFO_URL = 'https://api.themoviedb.org/3/movie/'+str(id)+'?api_key='+str(os.getenv('TMDB_KEY'))+'&language=en-US'
    info = requests.get(INFO_URL)
    data = info.json()
    title = str(data["title"])
    genres = ", ".join(genre["name"] for genre in data["genres"])
    poster_path = data['poster_path']
    if poster_path == None:
        poster = None;
    poster = POSTER_PATH_3 + poster_path
    lil_poster = POSTER_PATH + poster_path
    tagline = data['tagline']
    overview = data['overview']
    release_date = data['release_date']
    
    return (title, genres, poster, tagline, overview, release_date, lil_poster)

def get_favorites(favs):
    titles =[]
    posters =[]
    ids =[]
    taglines=[]
    for i in range(len(favs)):
        INFO_URL = 'https://api.themoviedb.org/3/movie/'+str(favs[i])+'?api_key='+str(os.getenv('TMDB_KEY'))+'&language=en-US'
        info = requests.get(INFO_URL)
        data = info.json()
        title = data['title']
        ids.append(int(str(favs[i])))
        titles.append(title)
        poster_path = data['poster_path']
        if poster_path == None:
            poster= None
        poster = str(POSTER_PATH + poster_path)
        posters.append(poster)
        tagline = data['tagline']
        taglines.append(tagline)
    return {
        'fav_titles': list(titles),
        'fav_posters': list(posters),
        'fav_ids': list(ids),
        'fav_taglines': list(taglines),
    }