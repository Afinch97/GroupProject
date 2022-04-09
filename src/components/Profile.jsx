import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { fetchFavoriteMovies } from './Favorites';
import { flaskClient } from '../fetcher';
import MovieTile from './MovieTile';
import Spinner from './Spinner';

async function fetchRecommended() {
  try {
    const response = await flaskClient.get('/recommended/movie');
    return response.data.data;
  } catch (error) {
    return error;
  }
}

function FavoriteMovieList() {
  const [movieFavorites, setMovieFavorites] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovieList() {
      setMovieFavorites(await fetchFavoriteMovies());
      setLoading(false);
    }
    fetchMovieList();
  }, []);

  return (
    <>
      <Row as="h2">
        <Col className="text-center">
          Favorite Movies
        </Col>
      </Row>
      {isLoading && <Row><Spinner /></Row>}
      <Row>
        {!isLoading
          && movieFavorites.map((movie) => <MovieTile movie={movie} key={movie.id} userFavorite />)}
      </Row>
    </>
  );
}
function RecommendedMovieList() {
  const [movieRecommendations, setMovieRecommendations] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovieList() {
      setMovieRecommendations(await fetchRecommended());
      setLoading(false);
    }
    fetchMovieList();
  }, []);

  return (
    <>
      <Row as="h2">
        <Col className="text-center">
          Recommended Movies
        </Col>
      </Row>
      {isLoading && <Row><Spinner /></Row>}
      <Row>
        {!isLoading
          && movieRecommendations.map((movie) => (
            <MovieTile
              movie={movie}
              key={movie.id}
              userFavorite
            />
          ))}
      </Row>
    </>
  );
}

function ProfilePage() {
  return (
    <Container fluid>
      <FavoriteMovieList />
      <RecommendedMovieList />
    </Container>
  );
}

export default ProfilePage;
