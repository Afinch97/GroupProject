# pylint: skip-file

from typing import List, Optional
from flask_login import UserMixin
from database import db
from dataclasses import dataclass
from werkzeug.security import generate_password_hash, check_password_hash





"""N-M relationship between users and movies"""
favorite_relationship = db.Table(
    "movie_favorites",
    # db.metadata,
    db.Column("movie_id", db.ForeignKey("movie.id"), primary_key=True),
    db.Column("user_id", db.ForeignKey("user.username"), primary_key=True),
)

"""N-M relationship between movies and genres."""
genre_relationship = db.Table(
    "movie_genres",
    # db.metadata,
    db.Column("genre_id", db.ForeignKey("genre.id"), primary_key=True),
    db.Column("movie_id", db.ForeignKey("movie.id"), primary_key=True),
)

@dataclass
class Movie(db.Model):
    """
    Class that encapsulates the movies that are saved in the database.
    It is used in relationships invloving user comments, user favorites, and user ratings
    """

    __tablename__ = "movie"
    id: int = db.Column(db.Integer, index=True, unique=True, primary_key=True)
    fans: List['User'] = db.relationship(
        "User", secondary=favorite_relationship, back_populates="favorite_movies"
    )
    title: str = db.Column(db.String)
    tagline: str = db.Column(db.String)
    overview: str = db.Column(db.Text)
    wiki_url: str = db.Column(db.String)
    image_url: str = db.Column(db.String)
    genres: List['Genre'] = db.relationship(
        'Genre', secondary=genre_relationship, backref=db.backref('movies')
    )
    def add_genre(self, genre_name: str):
        genre = Genre.query.filter_by(name=genre_name).first()
        if genre is None:
            raise ValueError(f'Genre with name {genre_name} does not exist in database')
        self.genres.append(genre)
        db.session.commit()

    def genre_str(self) -> str:
        """Convert the genres for this movie into a string list, delimited by commas"""
        return ", ".join([genre.name for genre in self.genres])

@dataclass
class User(UserMixin, db.Model):
    """
    Users that have registered an account with the website.
    Has password validation user's favorite movies.
    """

    username: str = db.Column(db.String, index=True, unique=True, primary_key=True)
    email: str = db.Column(db.String, unique=True)
    password: str = db.Column(db.String)
    favorite_movies: List[Movie] = db.relationship(
        "Movie", secondary=favorite_relationship, back_populates="fans"
    )

    def password_is_valid(self, password) -> bool:
        """Helper method to validate password against the stored hashed password"""
        return check_password_hash(self.password, password)

    def update_password(self, password):
        self.password = generate_password_hash(password, method="sha256")
        db.session.commit()
    
    def get_id(self) -> str:
        """Used for Flask Login"""
        return self.username

    def add_favorite_movie(self, movie_id: int) -> None:
        """If movie exists in database, add to this user's favorites"""
        movie = Movie.query.get(movie_id)
        if movie is not None:
            self.favorite_movies.append(movie)
            db.session.commit()

    def remove_favorite_movie(self, movie_id: int) -> None:
        """Remove user's rating for the movie with the given movie_id"""
        movie = Movie.query.get(movie_id)
        if movie is not None:
            try:
                self.favorite_movies.remove(movie)
                db.session.commit()
            except ValueError:
                pass
                
@dataclass
class Genre(db.Model):
    """The genre for a movie. The name must be unique"""
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String)


def get_genre_by_name(genre_name: str) -> Optional[Genre]:
    return Genre.query.filter_by(name=genre_name).first()

def get_movie_by_name(movie_name: str) -> Optional[Movie]:
    return Movie.query.filter_by(title=movie_name).first()