import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { flaskClient } from '../fetcher';
import MovieTile from './MovieTile';
import Spinner from './Spinner';

export async function fetchFavoriteMovies() {
  try {
    const response = await flaskClient.get('/favorites');
    return response.data.data;
  } catch (error) {
    return error;
  }
}

function Favorites() {
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      setMovieRecommendations(await fetchFavoriteMovies());
      setLoading(false);
    }
    fetchMovies();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Your Favorites</h2>
      <Container>
        {isLoading ? <Spinner />
          : (movieRecommendations.map((movie) => (
            <MovieTile
              movie={movie}
              userFavorite
              key={movie.id}
            />
          )))}
      </Container>
    </div>
  );
}

export default Favorites;
