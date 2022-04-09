import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import Login from './Login';
import MovieTile from './MovieTile';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

// // const mock = new MockAdapter(axios);

// const mockAuthResponse = {
//   email: 'test@test.com',
//   is_auth: true,
//   status: 'authenticated',
//   username: 'test',
// };

const server = setupServer(
  rest.get('/api/add/:id', (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.get('/api/remove/:id', (req, res, ctx) => {
    return res(ctx.status(201));
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

function Dependecies({ children }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
}

test('movie tile displays title and overview', async () => {
  const movie = {
    title: 'Test Title',
    overview: 'overview',
    image_url: 'example.png',
  };
  render(<MovieTile movie={movie} />);
  await waitFor(() => screen.getByText(/Test Title/i));
  await waitFor(() => screen.getByText(/overview/i));
  const title = screen.getByText(/Test Title/i);
  const overview = screen.getByText(/overview/i);
  expect(title).toBeInTheDocument();
  expect(overview).toBeInTheDocument();
});

test('movie tile displays favorite button for movies that are not currently favorited', async () => {
  const movie = {
    title: 'Test Title',
    overview: 'overview',
    image_url: 'example.png',
  };
  render(<MovieTile movie={movie} />);
  await waitFor(() => screen.getByRole('button', { name: /favorite/i }));
  const button = screen.getByRole('button', { name: /favorite/i });
  expect(button).toBeInTheDocument();
});

// test('movie tile displays unfavorite button for movies that are currently favorited', async () => {
//   const movie = {
//     title: 'Test Title',
//     overview: 'overview',
//     image_url: 'example.png',
//     id: '123',
//   };
//   render(<MovieTile movie={movie} userFavorite />);
//   await waitFor(() => screen.getByRole('button', { name: /unfavorite/i }));
//   const button = screen.getByRole('button', { name: /unfavorite/i });
//   expect(button).toBeInTheDocument();
//   fireEvent.click(button);
//   await waitFor(() => screen.getByRole('button', { name: /favorite/i }));
//   const button2 = screen.getByRole('button', { name: /favorite/i });
//   expect(button2).toBeInTheDocument();
// });
