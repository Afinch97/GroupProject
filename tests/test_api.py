from GroupProject.app import app as prj_app
import pytest


@pytest.fixture()
def app():
    prj_app.config.update({
        'TESTING': True
    })
    yield prj_app
    

@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


def test_login(client):
    resp = client.get("/login")
    assert resp.status_code == 200