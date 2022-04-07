import unittest
import requests


class TestApi(unittest.TestCase):

    def setUp(self) -> None:
        return super().setUp()

    def test_login(self):
        r = requests.get("http://127.0.0.1:5000/favs")
        self.assertEqual(r.status_code, 200)


if __name__ == "__main__":
    unittest.main()