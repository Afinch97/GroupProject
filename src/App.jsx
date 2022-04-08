import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  Home, Register, Search, SearchResult, Movie, NavBar, AuthProvider,
  ProfilePage, NavBar2, Login, MovieList, Favorites,
} from './components';
import { Auth, RequireAuth } from './components/Auth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <RequireAuth>
            <NavBar2>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/movies" element={<MovieList />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route
                  path="/searchy"
                  element={(
                    <>
                      <NavBar />
                      <Search />
                    </>
            )}
                />
                <Route
                  path="/searchy/:query"
                  element={(
                    <>
                      <NavBar />
                      <SearchResult />
                    </>
            )}
                />
                <Route
                  path="/info/:movieId"
                  element={(
                    <>
                      <NavBar />
                      <Movie />
                    </>
            )}
                />
                <Route
                  path="*"
                  element={(
                    <Home />
            )}
                />
              </Routes>
            </NavBar2>
          </RequireAuth>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
