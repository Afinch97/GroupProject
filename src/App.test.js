import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { flaskClient } from './fetcher';
import axios from 'axios';
import App from './App';
import { UNAUTHENTICATED } from './components/Auth';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// const mock = new MockAdapter(axios);

const mockAuthResponse = {
  email: 'test@test.com',
  is_auth: true,
  status: 'authenticated',
  username: 'test',
};

const server = setupServer(
  rest.get('/api/auth', (req, res, ctx) => {
    return res(ctx.json(mockAuthResponse));
  })
);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

test('redirects user to login screen when user is not authenticated', async () => {
  server.use(
    rest.get('/api/auth', (req, res, ctx) => {
      return res(ctx.status(401));
    })
  );
  render(<App />);
  await waitFor(() => screen.getByRole('button', { name: /submit/i }));
  const button = screen.getByRole('button', { name: /submit/i });
  expect(button).toBeInTheDocument();
});
