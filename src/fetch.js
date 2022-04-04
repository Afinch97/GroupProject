import axios from 'axios';

// const headers = { Authorization: `Bearer ${process.env.TMDB_KEY}` };

export const movieClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3', timeout: 5000, params: { api_key: `${process.env.TMDB_KEY}` },
});

export async function searchMovie(movieTitle) {
  try {
    const response = await movieClient.get('/search/movie', { params: { query: movieTitle } });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
