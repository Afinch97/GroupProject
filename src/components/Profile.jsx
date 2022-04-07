import React, { useEffect, useState } from 'react';
import { flaskClient } from '../fetcher';

async function fetchRecommended() {
  try {
    const response = await flaskClient.get('/recommended/movie');
    return response.data;
  } catch (error) {
    return error;
  }
}

function MovieTile(movie) {
  const { title } = movie;
  return (
    <div>
      <div>{title}</div>
    </div>
  );
}

function FavoriteMovieList() {
  const [movieRecommendations, setMovieRecommendations] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      setMovieRecommendations(await fetchRecommended());
      setLoading(false);
    }
    fetchMovies();
  }, []);

  return (
    <div>
      <h2>Favorite Movies</h2>
      <div>
        {isLoading && <div>Loading... </div>}
        {!isLoading
          && movieRecommendations.map((movie) => <MovieTile movie={movie} key={movie.id} />)}
      </div>
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
