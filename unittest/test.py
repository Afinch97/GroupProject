"""A dummy docstring."""
import unittest
import requests


class TestApi(unittest.TestCase):
    """A dummy docstring."""
    def setUp(self) -> None:
        """A dummy docstring."""
        return super().setUp()

    def test_login(self):
        """A dummy docstring."""
        request = requests.get("http://10.0.0.29:8080")
        self.assertEqual(request.status_code, 200)


if __name__ == "__main__":
    unittest.main()
