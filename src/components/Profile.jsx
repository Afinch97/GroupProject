import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { fetchFavoriteMovies } from './Favorites';
import { flaskClient } from '../fetcher';
import MovieTile from './MovieTile';
import Spinner from './Spinner';

async function fetchRecommended() {
  try {
    const response = await flaskClient.get('/recommended/movie');
    return response.data;
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
    <div>
      <h2>Favorite Movies</h2>
      <Container>
        {isLoading && <Spinner />}
        {!isLoading
          && movieFavorites.map((movie) => <MovieTile movie={movie} key={movie.id} userFavorite />)}
      </Container>
    </div>
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
    <div>
      <h2>Recommended Movies</h2>
      <Container>
        {isLoading && <Spinner />}
        {!isLoading
          && movieRecommendations.map((movie) => <MovieTile movie={movie} key={movie.id} />)}
      </Container>
    </div>
  );
}

function ProfilePage() {
  return (
    <div>
      <FavoriteMovieList />
    </div>
  );
}

export default ProfilePage;
