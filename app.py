# pylint: disable=no-member
import json
import os
import re
from multiprocessing import synchronize
from typing import List, Dict

import requests
import sqlalchemy
from dotenv import find_dotenv, load_dotenv
from flask import (Blueprint, Flask, flash, jsonify, redirect, render_template,
                   request, url_for)
from flask_login import (LoginManager, UserMixin, current_user, login_required,
                         login_user, logout_user)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

import media_wiki
from database import db, setup_database
from models import User, Movie, Genre
from tastedive import get_movie_recommendations
from tmdb import (get_favorites, get_genres, get_movie_info, get_trending, movie_info,
                  movie_search, single_movie_search)
from operator import attrgetter

# from GroupProject.MediaWiki import get_wiki_link
# from GroupProject.database import db, setup_database
# from GroupProject.models import User, Movie, Genre
# from GroupProject.tmdb import (get_favorites, get_genres, get_movie_info, get_trending, movie_info,movie_search)

load_dotenv(find_dotenv())

def create_app():
    flask_app = Flask(__name__)
    flask_app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
    flask_app.config["SECRET_KEY"] = os.getenv('SECRET_KEY',"secret-key-goes-here")
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    if flask_app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgres://"):
        flask_app.config["SQLALCHEMY_DATABASE_URI"] = flask_app.config[
            "SQLALCHEMY_DATABASE_URI"
        ].replace("postgres://", "postgresql://")
    # Gets rid of a warning
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    setup_database(flask_app)
    # db = SQLAlchemy(flask_app, session_options={"autocommit": True})
    return flask_app

app = create_app()
# db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(username):
    return User.query.get(username)


@app.route('/login')
def login_page():
    return render_template('index.html')

login_manager.login_view = 'login_page'

PYTHON_ENV = os.getenv('PYTHON_ENV', 'production')
TEMPLATE_FOLDER = './static/react' if PYTHON_ENV == 'production' else "./static/parcel"
# set up a separate route to serve the index.html file generated
# by create-react-app/npm run build.
# By doing this, we make it so you can paste in all your old app routes
# from Milestone 2 without interfering with the functionality here.
api = Blueprint("api", __name__, template_folder=TEMPLATE_FOLDER, url_prefix="/api")

# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def catch_all_route(path):
#     return render_template("index.html")

def get_auth_status():
    AUTHENTICATED = 'authenticated'
    UNAUTHENTICATED = 'unauthenticated'
    STATUS = 'status'
    IS_AUTH = 'is_auth'
    response = {STATUS: UNAUTHENTICATED, IS_AUTH: False, 'email': None, 'username': None}
    if current_user.is_authenticated:
        response[STATUS] = AUTHENTICATED
        response[IS_AUTH] = True
        response['username'] = current_user.username
        response['email'] = current_user.email
    return response

@api.route('/auth')
def auth_check():
    """Endpoint for testing authentication status of user"""
    auth_status = get_auth_status()
    if not auth_status['is_auth']:
        return jsonify(auth_status), 401
    return jsonify(get_auth_status())


@api.route("/login", methods=["POST"])
def login():
    data = request.json
    print(data)
    username = data.get("username")
    password = data.get("password")
    remember = data.get("remember", False)
    user = User.query.get(username)
    if not user:
        return jsonify({"message":"User does not exist, please create new account."}), 401
    if not user.password_is_valid(password):
        flash("Username or Password Incorrect")
        return jsonify({"message": "Password is incorrect"}), 401
    login_user(user, remember=remember)
    # return jsonify({"success": "Successfully logged in"})
    return jsonify(get_auth_status())


@api.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data["email"]
    name = data["username"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()
    if user:

        return jsonify({"error":"User already exists"})
    new_user = User(email=email, username=name, password=generate_password_hash(password, method='sha256'))
    # db.session.begin()
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": "successfully Registered"})


@api.route("/favorites", methods=["GET", "POST"])
@login_required
def favorites():
    return jsonify({'data': serialize_movie_list(current_user.favorite_movies)})


@api.route("/search", methods=["GET"])
# @login_required
def search():
    data = get_genres()
    movies = get_trending()
    title = "Trending"
    if request.method == "POST":
        query = request.get_json()
        title = query
        movies = movie_search(query)

    titles = movies["titles"]
    overviews = movies["overviews"]
    posters = movies["posters"]
    ids = movies["ids"]
    taglines = movies["taglines"]

    wikiLinks = []
    for i in range(len(titles)):
        links = media_wiki.get_wiki_link(titles[i])
        try:
            wikiLinks.append(
                links[3][0]
            )  # This is the part that has the link to the wikipedia page
        except:
            wikiLinks.append("#")  # The links get out of order If I don't do this
            print("Link doesn't exist")
    search_dict = {
        "title": title,
        "genres": data,
        "titles": titles,
        "overviews": overviews,
        "posters": posters,
        "taglines": taglines,
        "ids": ids,
        "wikiLinks": wikiLinks,
    }
    return jsonify(search_dict)


@api.route("/search/<query>", methods=["GET"])
@login_required
def searchResult(query: str):
    data = get_genres()
    title = query
    movies = movie_search(query)

    titles = movies["titles"]
    overviews = movies["overviews"]
    posters = movies["posters"]
    ids = movies["ids"]
    taglines = movies["taglines"]

    wikiLinks = []
    for i in range(len(titles)):
        links = media_wiki.get_wiki_link(titles[i])
        try:
            wikiLinks.append(
                links[3][0]
            )  # This is the part that has the link to the wikipedia page
        except:
            wikiLinks.append("#")  # The links get out of order If I don't do this
            print("Link doesn't exist")
    search_dict = {
        "title": title,
        "genres": data,
        "titles": titles,
        "overviews": overviews,
        "posters": posters,
        "taglines": taglines,
        "ids": ids,
        "wikiLinks": wikiLinks,
    }
    return jsonify(search_dict)


def fetch_movie_by_title(title: str):
    return single_movie_search(title)


def find_movies_by_recommendations(recommendations: List[Dict[str, str]]):
    title_dict = {movie.get('Name') : movie.get('wUrl') for movie in recommendations}
    res = []
    for curr_title in title_dict:
        movie = Movie.query.filter(Movie.title==curr_title).first()
        if movie is not None:
            res.append(movie)
        else:
            search_result_info = single_movie_search(curr_title)
            print(f'{search_result_info=}')
            checker = Movie.query.get(search_result_info.get('id'))
            if checker is not None:
                res.append(checker)
            if search_result_info and checker is None:
                if search_result_info.get('title') == curr_title:
                    genre_ids = search_result_info.pop('genre_ids')
                    new_movie = Movie(**search_result_info, wiki_url=title_dict.get(curr_title))
                    for genre in genre_ids:
                        new_movie.genres.append(Genre.query.get(genre))
                    db.session.add(new_movie)
                    db.session.commit()
                    res.append(new_movie)
    return res


@api.route("/movie/<id>", methods=["POST", "GET"])
@login_required
def viewMovie(id):
    (title, genres, poster, tagline, overview, release_date, lil_poster) = movie_info(id)
    # if request.method == "POST":
    #     data = request.get_json()
    #     rating = data["rating"]
    #     textReview = data["textReview"]
    #     new_rating = Reviews(movie_id=int(id), user=current_user.name, rating=rating, text=textReview)
    #     db.session.begin()
    #     db.session.add(new_rating)
    #     db.session.commit()

    # reviews = Reviews.query.filter_by(movie_id=id).all()
    reviews = []

    if reviews:
        users = []
        ratings = []
        texts = []
        for i in reviews:
            print(i.__dict__)
            users.append(i.__dict__.get("user"))
            ratings.append(i.__dict__.get("rating"))
            texts.append(i.__dict__.get("text"))
        viewMovie_dict = {
            "current_user": current_user.name,
            "title": title,
            "genres": genres,
            "poster": poster,
            "tagline": tagline,
            "overview": overview,
            "release_date": release_date,
            "id": id,
            "user": users,
            "rating": ratings,
            "text": texts,
            "reviews": "true",
            "rev_length": len(ratings),
        }
        return jsonify(viewMovie_dict)
    viewMovie_dict = {
        "current_user": current_user.name,
        "title": title,
        "genres": genres,
        "poster": poster,
        "tagline": tagline,
        "overview": overview,
        "release_date": release_date,
        "id": id,
        "reviews": "false",
    }
    return jsonify(viewMovie_dict)

def serialize_movie(movie: Movie):
    attributes = ['title', 'id', 'overview', 'tagline', 'image_url', 'wiki_url']
    return dict(zip(attributes, attrgetter(*attributes)(movie)))

def serialize_movie_list(movies: List[Movie]):
    return  [serialize_movie(movie) for movie in movies]


@api.route('/movies')
def fetch_movies():
    movies = Movie.query.all()
    return jsonify({'data': serialize_movie_list(movies)})

@api.route('/recommended/movie')
@login_required
def get_recommended_movies():
    favorite_movie_titles = [movie.title for movie in current_user.favorite_movies]
    recommended = get_movie_recommendations(favorite_movie_titles)
    recommended_movies = find_movies_by_recommendations(recommended)
    print(recommended_movies)
    return jsonify({'data': serialize_movie_list(recommended_movies)})

@api.route('/add/<int:movie_id>', methods=["POST", "GET"])
@login_required
def addMovie(movie_id: int):
    current_user.add_favorite_movie(movie_id)
    return jsonify("Movie is added")

@api.route('/remove/<int:movie_id>', methods=["POST","GET"])
@login_required
def removeMovie(movie_id: int):
    movie = Movie.query.get(movie_id)
    if movie is None:
        return jsonify({'message': 'Movie does not exist'}), 404
    current_user.remove_favorite_movie(movie_id)
    return jsonify(serialize_movie(movie))

# @api.route('/reviewbbgurl', methods=["GET"])
# @login_required
# def gimme_my_reviews():
#     name = current_user.name
#     reviews = Reviews.query.filter_by(user=name).all()
#     if reviews:
#         my_reviews=[]
#         ratings=[]
#         texts=[]
#         movie_ids=[]
#         movies={}
#         for i in reviews:
#             print (i.__dict__)
#             my_reviews.append(i.__dict__.get('id'))
#             ratings.append(i.__dict__.get('rating'))
#             texts.append(i.__dict__.get('text'))
#             movie_ids.append(i.__dict__.get('movie_id'))
#             (title, genres, poster, tagline, overview, release_date, lil_poster) = movie_info(i.__dict__.get('movie_id'))
#             movies[i.__dict__.get('movie_id')] = (title, lil_poster)
#         view_ratings_dicts = {
#             "review_ids": my_reviews,
#             "current_user": current_user.name,
#             "texts": texts,
#             "ratings": ratings,
#             "movies": movies,
#             "movie_ids": movie_ids,
#             "length":len(ratings)
#         }
#         return jsonify(view_ratings_dicts)
#     return jsonify({"error":"you got no comments bro"})

# @bp.route('/delete_comment/<e>', methods=["GET"])
# def remove_that_review(e):
#     reviews = Reviews.query.filter_by(id=e).first()
#     if reviews is None:
#         return (jsonify("Review does not exist"))
#     db.session.begin()
#     db.session.delete(reviews)
#     db.session.commit()
#     return (jsonify("Removed from Reviews"))



@api.route("/logout", methods=['POST'])
@login_required
def logout():
    logout_user()
    # return redirect(url_for('home'))
    return jsonify({})


app.register_blueprint(api)


@app.route('/')
def home():
    return render_template("index.html")

@app.errorhandler(404)
def catch_all_route(_):
    """
    Catch all routes that don't match any of the above templates
    Return a react app for these routes.
    """
    return render_template("index.html")


# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def catch_all_route(path):
#     return render_template("index.html")


app.run(debug=True)
