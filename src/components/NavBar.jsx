import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './Auth';
import './NavBar.css';

function NavBar() {
  const [term, setTerm] = useState('');
  const { signOut } = useAuth();
  const Submit = (e) => {
    e.preventDefault();
    // navigate(`/searchy/${term}`)
    window.location = `/${term}`;
  };
  return (
    <div className="topnav" id="myTopNav">
      <NavLink to="/searchy">Home</NavLink>
      <a href="https://github.com/Afinch97/Milestone-3-SE" target="_blank" rel="noreferrer">About</a>
      <NavLink to="/favs">Favorites</NavLink>
      <NavLink to="/myComments">Comments</NavLink>
      <div className="search-container">
        <form onSubmit={Submit}>
          <input type="text" placeholder="Search..." name="search" onChange={(e) => setTerm(e.target.value)} value={term} />
          <button type="submit"><i className="fa fa-search" /></button>
        </form>
      </div>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a onClick={signOut} className="Logout">Logout</a>
    </div>
  );
}

export default NavBar;
