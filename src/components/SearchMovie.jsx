import React, { useState } from 'react';
import { searchMovie,searchMovieWithKey } from '../fetcher';

function SearchMovie() {
  const [title, setTitle] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [searchResult, setSearchResult] = useState('Waiting To Display Result');

  async function search() {
    if (!apiKey) {

      const response = await searchMovie(title);
      setSearchResult(JSON.stringify(response, null, 2));
    } else {
      const response = await searchMovieWithKey(title, apiKey);
      setSearchResult(JSON.stringify(response, null, 2));

    }
  }

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Title'
      />
      <br />
      <input
        type="text"
        value={apiKey}
        placeholder='API KEY'
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button type="button" onClick={search}>Search Movie</button>
      <div>{searchResult}</div>
    </div>
  );
}

export default SearchMovie;