import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { flaskClient } from '../fetcher';
import MovieTile from './MovieTile';

async function fetchAllMovies() {
  try {
    const response = await flaskClient.get('/movies');
    return response.data.data;
  } catch (error) {
    return error;
  }
}

function MovieList() {
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      setMovieRecommendations(await fetchAllMovies());
      setLoading(false);
    }
    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>All Movies</h2>
        <Container>
          <div>Loading... </div>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>All Movies</h2>
      <Container>
        {movieRecommendations.map((movie) => (
          <MovieTile
            movie={movie}
            userFavorite={false}
            key={movie.id}
          />
        ))}
      </Container>
    </div>
  );
}

export default MovieList;
