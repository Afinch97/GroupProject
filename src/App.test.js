import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { flaskClient } from './fetcher';
import App from './App';
import { UNAUTHENTICATED } from './components/Auth';

const mock = new MockAdapter(flaskClient);

const mockAuthResponse = {
  email: 'test@test.com', is_auth: true, status: 'authenticated', username: 'test',
};

beforeEach(() => {
  // suppress console.error calls, that are called from unauthenticated user
  // jest.spyOn(console, 'error').mockImplementation(() => {});
    
});

test('renders learn react link', async () => {
  mock.onGet('/auth').reply(401);
  render(<App />);
  await waitFor(() => screen.getByRole('button', { name: /submit/i }));
  const button = screen.getByRole('button', { name: /submit/i });
  expect(button).toBeInTheDocument();
});
