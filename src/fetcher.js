import axios from 'axios';

export const flaskClient = axios.create({
  baseURL: '/api', timeout: 5000,
});

export async function fetchAuthStatus() {
  try {
    const response = await flaskClient.get('/auth');
    return response.data;
  } catch (error) {
    return error;
  }
}

export async function removeMovieFavorite(movieId) {
  try {
    const response = await flaskClient.get(`/remove/${movieId}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

export async function addMovieFavorite(movieId) {
  try {
    const response = await flaskClient.get(`/add/${movieId}`);
    return response.data;
  } catch (error) {
    return error;
  }
}
