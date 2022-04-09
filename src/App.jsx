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
          <NavBar2>
            <RequireAuth>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
                    <Home />
                )}
                />
              </Routes>
            </RequireAuth>
          </NavBar2>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
