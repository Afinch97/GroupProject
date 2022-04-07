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
