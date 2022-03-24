from flask import (
    Flask,
    Blueprint,
    render_template,
    redirect,
    url_for,
    request,
    flash,
    jsonify,
)
from flask_login import (
    UserMixin,
    LoginManager,
    login_user,
    login_required,
    current_user,
    logout_user,
)
from sqlalchemy import false, over, table, select, true
from tmdb import get_trending, get_genres, movie_search, movie_info, get_favorites
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import over, table, select, update
from dotenv import find_dotenv, load_dotenv
from flask_sqlalchemy import SQLAlchemy
from multiprocessing import synchronize
import requests
import MediaWiki
import sqlalchemy
import os
import re

load_dotenv(find_dotenv())

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config["SECRET_KEY"] = "secret-key-goes-here"
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
if app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgres://"):
    app.config["SQLALCHEMY_DATABASE_URI"] = app.config[
        "SQLALCHEMY_DATABASE_URI"
    ].replace("postgres://", "postgresql://")
db = SQLAlchemy(app, session_options={"autocommit": True})
db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


class User(UserMixin, db.Model):
    id = db.Column(
        db.Integer, primary_key=True
    )  # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))


class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer)
    rating = db.Column(db.Integer)
    user = db.Column(db.String(1000))
    text = db.Column(db.String(1000))


class Favorites(db.Model):
    __tablename__ = "Favorites"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    movie = db.Column(db.Integer)

    def __repr__(self):
        return repr(int(self.movie))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# set up a separate route to serve the index.html file generated
# by create-react-app/npm run build.
# By doing this, we make it so you can paste in all your old app routes
# from Milestone 2 without interfering with the functionality here.
bp = Blueprint(
    "bp",
    __name__,
    template_folder="./static/react",
)

@bp.route("/")
def index():
    return render_template("index.html")

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print(data)
    email = data["username"]
    name = data["username"]
    password = data["password"]
    remember = data["remember"]
    
    user = User.query.filter_by(name=name).first()
    if not user:
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error":"User does not exist, please create new account."})
    if not user or not check_password_hash(user.password, password):
        flash("Username or Password Incorrect")
        return jsonify({"error":"Password is incorrect"})
    login_user(user, remember=remember)
    return jsonify({"success":"Successfully logged in"})

@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data["email"]
    name = data["username"]
    password = data["password"]
    
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error":"User already exists"})    
    new_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'))
    db.session.begin()
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"success":"successfully Registered"})

@bp.route("/favorites", methods=["GET","POST"])
@login_required
def favorites():
    fav_movies = Favorites.query.filter_by(email=current_user.email).all()
    print(fav_movies)
    favs = fav_movies
    if favs:
        fav_length = len(favs)
        print(fav_length)
        favorites = get_favorites(favs)
        fav_titles = favorites['fav_titles']
        fav_posters = favorites['fav_posters']
        fav_ids = favorites['fav_ids']
        fav_taglines = favorites['fav_taglines']
        print(favorites)
        
        fav_dict={
            "length" : fav_length,
            "titles" : fav_titles,
            "posters" : fav_posters,
            "taglines" : fav_taglines,
            "ids" : fav_ids,
        }    
        print(fav_dict)
        return jsonify(fav_dict)   
        
    return jsonify({"no favorites"})
        
@bp.route('/search', methods=["GET"])
@login_required
def search():
    data = get_genres()
    movies = get_trending()
    title = 'Trending'    
    if request.method == "POST":
        query = request.get_json()
        title = query
        movies = movie_search(query)
                     
    titles = movies['titles']
    overviews = movies['overviews']
    posters = movies['posters']
    ids = movies['ids']
    taglines = movies['taglines']
    
    wikiLinks=[]
    for i in range(len(titles)):
        links = MediaWiki.get_wiki_link(titles[i])
        try:
            wikiLinks.append(links[3][0])#This is the part that has the link to the wikipedia page
        except:
            wikiLinks.append("#")#The links get out of order If I don't do this
            print("Link doesn't exist")
    search_dict={
        "title" : title,
        "genres" : data,
        "titles" : titles,
        "overviews" : overviews, 
        "posters" : posters,
        "taglines" : taglines,
        "ids" : ids,
        "wikiLinks" : wikiLinks,
    }   
    return jsonify(search_dict)

@bp.route('/search/<query>', methods=["GET"])
@login_required
def searchResult(query):
    data = get_genres()
    title = query
    movies = movie_search(query)
                     
    titles = movies['titles']
    overviews = movies['overviews']
    posters = movies['posters']
    ids = movies['ids']
    taglines = movies['taglines']
    
    wikiLinks=[]
    for i in range(len(titles)):
        links = MediaWiki.get_wiki_link(titles[i])
        try:
            wikiLinks.append(links[3][0])#This is the part that has the link to the wikipedia page
        except:
            wikiLinks.append("#")#The links get out of order If I don't do this
            print("Link doesn't exist")
    search_dict={
        "title" : title,
        "genres" : data,
        "titles" : titles,
        "overviews" : overviews, 
        "posters" : posters,
        "taglines" : taglines,
        "ids" : ids,
        "wikiLinks" : wikiLinks,
    }   
    return jsonify(search_dict)

@bp.route('/movie/<id>', methods=["POST","GET"])
@login_required
def viewMovie(id):
    (title, genres, poster, tagline, overview, release_date, lil_poster) = movie_info(id)
    if request.method == "POST":
        data = request.get_json()
        rating = data["rating"]
        textReview = data["textReview"]
        new_rating = Reviews(movie_id=int(id), user=current_user.name, rating=rating, text=textReview)
        db.session.begin()
        db.session.add(new_rating)
        db.session.commit()

    reviews = Reviews.query.filter_by(movie_id=id).all()
    
    if reviews:
        users=[]
        ratings=[]
        texts=[]
        for i in reviews:
            print (i.__dict__)
            users.append(i.__dict__.get('user'))
            ratings.append(i.__dict__.get('rating'))
            texts.append(i.__dict__.get('text'))
        viewMovie_dict={
            "current_user": current_user.name,
            "title" : title,
            "genres" : genres,
            "poster" : poster, 
            "tagline" : tagline,
            "overview" : overview,
            "release_date" : release_date, 
            "id" : id,
            "user":users, 
            "rating":ratings,
            "text":texts,
            "reviews":"true",
            "rev_length":len(ratings),
        }
        return jsonify(viewMovie_dict)
    viewMovie_dict={
        "current_user": current_user.name,
        "title" : title,
        "genres" : genres,
        "poster" : poster, 
        "tagline" : tagline,
        "overview" : overview,
        "release_date" : release_date, 
        "id" : id,
        "reviews":"false"
    }   
    return jsonify(viewMovie_dict)

@bp.route('/add/<id>', methods=["POST","GET"])
@login_required
def addMovie(id):
    favorites = Favorites.query.filter(Favorites.email.like("%"+current_user.email+"%")).all()
    print(favorites)
    if favorites is None:
        new_movie = Favorites(email=current_user.email, movie=int(id))
        db.session.begin()
        db.session.add(new_movie)
        db.session.commit()
    if id in favorites:
        return(jsonify("Movie is already added"))
    new_movie = Favorites(email=current_user.email, movie=int(id))
    db.session.begin()
    db.session.add(new_movie)
    db.session.commit()
    return(jsonify("Movie is added"))

@bp.route('/remove/<id>', methods=["POST","GET"])
@login_required
def removeMovie(id):
    favorites = Favorites.query.filter_by(email=current_user.email,movie=id).first()
    if favorites is None:
        return (jsonify("Not in Favorites"))
    db.session.begin()
    db.session.delete(favorites)
    db.session.commit()
    return (jsonify("Removed from Favorites"))

@bp.route('/reviewbbgurl', methods=["GET"])
@login_required
def gimme_my_reviews():
    name = current_user.name
    reviews = Reviews.query.filter_by(user=name).all()
    if reviews:
        my_reviews=[]
        ratings=[]
        texts=[]
        movie_ids=[]
        movies={}
        for i in reviews:
            print (i.__dict__)
            my_reviews.append(i.__dict__.get('id'))
            ratings.append(i.__dict__.get('rating'))
            texts.append(i.__dict__.get('text'))
            movie_ids.append(i.__dict__.get('movie_id'))
            (title, genres, poster, tagline, overview, release_date, lil_poster) = movie_info(i.__dict__.get('movie_id'))
            movies[i.__dict__.get('movie_id')] = (title, lil_poster)
        view_ratings_dicts = {
            "review_ids": my_reviews,
            "current_user": current_user.name,
            "texts": texts, 
            "ratings": ratings,
            "movies": movies,
            "movie_ids": movie_ids, 
            "length":len(ratings)
        }
        return jsonify(view_ratings_dicts)
    return jsonify({"error":"you got no comments bro"})

@bp.route('/delete_comment/<e>', methods=["GET"])
def remove_that_review(e):
    reviews = Reviews.query.filter_by(id=e).first()
    if reviews is None:
        return (jsonify("Review does not exist"))
    db.session.begin()
    db.session.delete(reviews)
    db.session.commit()
    return (jsonify("Removed from Reviews"))
    

@bp.route('/logout')
@login_required
def logout():
    logout_user()

app.register_blueprint(bp)

app.run()
