import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './searchStyle.css';

function SearchResult() {
  const { query } = useParams();
  const [title, setTitle] = useState('');
  const [ids, setIds] = useState([]);
  const [posters, setPosters] = useState([]);
  const [taglines, setTaglines] = useState([]);
  const [titles, setTitles] = useState([]);
  const items = [];

  useEffect(() => {
    const getRepo = async () => {
      await fetch(`/api/search/${query}`)
        .then((response) => response.json())
        .then((data) => {
        // console.log(data);
        // console.log(data.ids);
          setTitle(data.title);
          setIds(data.ids);
          setPosters(data.posters);
          setTaglines(data.taglines);
          setTitles(data.titles);
        });
    };

    getRepo();
  }, [query]);
  // console.log(title, ids, titles, posters, taglines);
  const Add = (e) => {
    e.preventDefault();
    fetch(`/api/add/${e}`);
  };

  for (let i = 0; i < 10; i += 1) {
    items.push(
      <div className="item">
        <p>
          <h2>
            (
            {i + 1}
            )
            {titles[i] }
          </h2>
          <Link to={`/info/${ids[i]}`}><input type="submit" value="More info" /></Link>
        </p>
        <img src={String(posters[i])} alt="movie-poster" />
        <p>{ taglines[i] }</p>
        <button onClick={() => Add(ids[i])} type="button">Add to Favorites</button>
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
    </>
  );
}

export default SearchResult;
