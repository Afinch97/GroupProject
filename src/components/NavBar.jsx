import React, { useState } from 'react';
import "./NavBar.css"
import { NavLink, useNavigate, Link } from 'react-router-dom';

const NavBar = () => {
  const [term, setTerm] = useState("")
  let navigate = useNavigate();
  const logout = () =>{
    fetch('/logout')
    window.location = '/';
  }
  const Submit = (e)  => {
    e.preventDefault();
    //navigate(`/searchy/${term}`)
    window.location = `/searchy/${term}`;
}
  return (
    <div class="topnav" id="myTopNav">
        <NavLink to={"/searchy"} ><a>Home</a></NavLink>
        <a href="https://github.com/Afinch97/Milestone-3-SE" target="_blank">About</a>
        <NavLink to={"/favs"}><a>Favorites</a></NavLink>
        <NavLink to={"/myComments"}><a>Comments</a></NavLink>
        <div class="search-container">
            <form onSubmit={Submit}>
                <input type="text" placeholder="Search..." name="search"onChange={e =>setTerm(e.target.value)} value={term}></input>
                <button type="submit"><i class="fa fa-search"></i></button>
            </form>
        </div>
        <a onClick={logout} class="Logout">Logout</a>
    </div>
  )
}

export default NavBar