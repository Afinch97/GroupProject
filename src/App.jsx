import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  Home, Register, Search, SearchResult, Movie, NavBar, AuthProvider, Login,
  ProfilePage, NavBar2,
} from './components';
import { Auth, RequireAuth } from './components/Auth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <RequireAuth>
            <Routes>
              <Route
                path="/"
                element={(
                  <>
                    <NavBar />
                    <Home />
                  </>
)}
              />
              <Route
                path="/auth"
                element={(
                  <>
                    <NavBar />
                    <Auth />
                  </>
)}
              />
              <Route
                path="/profile"
                element={(
                  <>
                    <NavBar />
                    <ProfilePage />
                  </>
)}
              />
              <Route
                path="/login"
                element={(
                  <>
                    <NavBar />
                    <Login />
                  </>
)}
              />
              <Route
                path="/register"
                element={(
                  <>
                    <NavBar />
                    <Register />
                  </>
)}
              />
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
                path="/:query"
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
                  <>
                    <NavBar />
                    <Home />
                  </>
                )}
              />
            </Routes>
          </RequireAuth>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
