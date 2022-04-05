import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Register, Search, SearchResult, Movie, NavBar, Favorites, Comments}from './components';

const App = () => {
 
  return ( 
  <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/searchy" element={<><NavBar /> <Search /></>} />
        <Route path="/searchy/:query" element={<><NavBar /><SearchResult /></>} />
        <Route path="/info/:movieId" element={<><NavBar /><Movie /></>} />
        <Route path="/favs" element={<><NavBar /><Favorites /></>} />
        <Route path="/myComments" element={<><NavBar /><Comments /> </>} />
      </Routes>             
    </Router>
  </div>
  
  );
}

export default App
