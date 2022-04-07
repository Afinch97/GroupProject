import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './searchStyle.css';

function Search() {
  const [title, setTitle] = useState('');
  const [ids, setIds] = useState([]);
  const [posters, setPosters] = useState([]);
  const [taglines, setTaglines] = useState([]);
  const [titles, setTitles] = useState([]);
  const items = [];
  const getRepo = async () => {
    await fetch('/api/search')
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title);
        setIds(data.ids);
        setPosters(data.posters);
        setTaglines(data.taglines);
        setTitles(data.titles);
      });
  };
  useEffect(() => getRepo(), []);
  // console.log(title, ids, titles, posters, taglines);
  const Add = (item) => {
    // console.log($event, item);
    fetch(`/api/add/${item}`);
  };

  for (let i = 0; i < 10; i += 1) {
    items.push(
      <div className="item">
        <p>
          <h2>
            (
            {i + 1}
            )
            {titles[i]}
          </h2>
          <Link to={`/info/${ids[i]}`}><input type="submit" value="More info" /></Link>
        </p>
        <img src={String(posters[i])} alt="movie-poster" />
        <p>{taglines[i]}</p>
        {/* {console.log(ids[i])} */}
        <button onClick={(e) => Add(ids[i], e)} type="button">Add to Favorites</button>
      </div>,
    );
  }
  return (
    <>
      <h1>
        {title}
        {' '}
        Movies
      </h1>
      <div className="container">
        {items}
      </div>
      <h2>
        Recommended movies
      </h2>
      <div className="container">
        { }
      </div>
    </>
  );
}

export default Search;
