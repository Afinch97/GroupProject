import unittest
from tastedive import movie_query_builder

class TasteDiveTest(unittest.TestCase):
    def test_movie_query_builder(self):
        movie_titles = ['Scream', 'The Last Test']
        expected = 'movie:Scream,movie:The Last Test'
        self.assertEqual(movie_query_builder(movie_titles), expected)

    def test_movie_query_builder_empty(self):
        movie_titles = []
        expected = ''
        self.assertEqual(movie_query_builder(movie_titles), expected)

    """
    Create mock of requests to test handle key error on invalid response
    Create mock of request to test valid response, ensure it handles the response well
    """




if __name__ == '__main__':
    unittest.main()