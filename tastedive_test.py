"""Unittest for query building the taste api"""
import unittest
# pylint: disable=import-error
from tastedive import movie_query_builder

class TasteDiveTest(unittest.TestCase):
    """Testing functions used for building Taste API queries"""

    # good function name does not need docstring
    # pylint: disable=missing-function-docstring
    def test_movie_query_builder(self):
        movie_titles = ['Scream', 'The Last Test']
        expected = 'movie:Scream,movie:The Last Test'
        self.assertEqual(movie_query_builder(movie_titles), expected)

    # good function name does not need docstring
    # pylint: disable=missing-function-docstring
    def test_movie_query_builder_empty(self):
        movie_titles = []
        expected = ''
        self.assertEqual(movie_query_builder(movie_titles), expected)



if __name__ == '__main__':
    unittest.main()
