"""
Creates the instanec of the SQLAlchemy `db` object that
is used throughout the application.
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def setup_database(flask_app):
    """Initialize the database"""
    db.init_app(flask_app)
    with flask_app.app_context():
        # db.drop_all()  # ONLY UNCOMMENT IF YOU WANT TO DROP ALL TABLES
        db.create_all()
