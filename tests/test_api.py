from GroupProject.app import app as prj_app
from GroupProject.tmdb import tmdb as prj_tmdb
from GroupProject.MediaWiki import MediaWiki as prj_MediaWiki
from GroupProject.database import database as prj_database

# change to your local folder name
import pytest


@pytest.fixture()
def app():
    prj_app.config.update({
        'TESTING': True
    })
    yield prj_app,prj_tmdb,prj_MediaWiki,prj_database
    

@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


def test_login(client):
    resp = client.get("/login")
    assert resp.status_code == 200