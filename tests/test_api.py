"""A dummy docstring."""
import json
import pytest
from GroupProject.app import app as prj_app


# change to your local folder name



@pytest.fixture()
def app():
    """A dummy docstring."""
    prj_app.config.update({
        'TESTING': True
    })
    yield prj_app


@pytest.fixture()
def client(app):
    """A dummy docstring."""
    return app.test_client()


@pytest.fixture()
def runner(app):
    """A dummy docstring."""
    return app.test_cli_runner()


def test_login_page(client):
    """Test the login page return well."""
    resp = client.get("/")
    assert resp.status_code == 200

# def test_login(client):
#     with client:
#         resp = client.post("/login", data={"username": "b","password":"12"})
#         # session is still accessible
#         # prj_app.get_auth_status()
#         # assert resp.status_code == 200

def test_login(client):
    """Authentication if input password wrong."""
    data = {
                "password": "1232",
                "remember": False,
                "username": "b"
    }
    # password: "123"
    # remember: false
    # username: "b"
    response = client.post("/api/login", data=json.dumps(data),
                           headers={"Content-Type": "application/json"},)
    assert response.status_code == 200
    # print(response.status_code)
    # print(response.text)
