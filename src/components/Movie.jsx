/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styleMovie.css';

function Movie() {
  const { movieId } = useParams();
  // console.log({ movieId });
  const [areReviews, setAreReviews] = useState(false);
  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState('');
  const [, setId] = useState();
  const [poster, setPoster] = useState('');
  const [tagline, setTagline] = useState('');
  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState();
  const [user, setUser] = useState([]);
  const [rating, setRating] = useState([]);
  const [text, setText] = useState([]);
  const [reviewLength, setReviewLength] = useState();
  const [startForm, setStartForm] = useState('Be the first to write a review:');
  const [inputs, setInputs] = useState({});
  const [current_user, setCurrent_user] = useState('');

  useEffect(() => {
    const getRepo = async () => {
      await fetch(`/api/movie/${movieId}`)
        .then((response) => response.json())
        .then((data) => {
        // console.log(data);
          setTitle(data.title);
          setId(data.id);
          setPoster(data.poster);
          setTagline(data.tagline);
          setOverview(data.overview);
          setPoster(data.poster);
          setReleaseDate(data.release_date);
          setGenres(data.genres);
          setCurrent_user(data.current_user);
          if (data.reviews === 'true') {
            setAreReviews(true);
            setUser(data.user);
            setRating(data.rating);
            setText(data.text);
            setReviewLength(data.rev_length);
            setStartForm('Write a Review:');
          }
        });
    };
    getRepo();
  }, [movieId]);
  // console.log(areReviews, genres, title, id, poster, tagline, overview,
  // releaseDate, user, rating, text, reviewLength);
  // console.log(reviewLength);
  const reviews = [];
  if (areReviews === true) {
    for (let i = 0; i < reviewLength; i += 1) {
      reviews.push(
        <>
          <div className="name_and_rating">
            {/* {console.log(user)}
            {console.log(rating)}
            {console.log(user[i])}
            {console.log(rating[i])} */}
            <h3>
              {user[i]}
              :
              {' '}
              {rating[i]}
            </h3>
          </div>
          <div className="review_text">
            {text[i]}
          </div>
          <br />
        </>,
      );
    }
  }
  const submit = (e) => {
    e.preventDefault();
    setUser((olduser) => [...olduser, current_user]);
    setRating((oldrating) => [...oldrating, inputs.rating]);
    setText((oldtext) => [...oldtext, inputs.textReview]);
    setReviewLength(reviewLength + 1);
    reviews.push(
      <>
        <div className="name_and_rating">
          <h3>
            {current_user}
            :
            {' '}
            {inputs.rating}
          </h3>
        </div>
        <div className="review_text">
          {inputs.textReview}
        </div>
        <br />
      </>,
    );
    fetch(`/api/movie/${movieId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inputs) });
  };

  return (
    <>
      <h2>{title}</h2>
      <form action="/add/{{id}}">
        <input type="submit" value="Add to Favorites" />
      </form>
      <div className="movieInfo">
        <div className="poster">
          <img src={poster} alt="movie-poster" />
        </div>
        <div className="details">
          <div className="title">{title}</div>
          {' '}
          {releaseDate}
          <br />
          {tagline}
          <br />
          {genres}
          <br />
          <br />
          {overview}
          <br />
        </div>
      </div>
      <div className="reviews">
        {areReviews === true
          && (
            <>
              <h2>Reviews:</h2>
              {reviews}
            </>
          )}
        <form onSubmit={submit} action="/movie/{{id}}" className="reviewbox">
          <h2>{startForm}</h2>
          <label htmlFor="rating">Rate the movie out of 10: </label>
          <input type="number" name="rating" min="0" max="10" onChange={(e) => setInputs({ ...inputs, rating: e.target.value })} value={inputs.rating} />
          <br />
          <label htmlFor="text">Review: </label>
          <input type="text" name="textReview" size="60" onChange={(e) => setInputs({ ...inputs, textReview: e.target.value })} value={inputs.textReview} />
          <br />
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </>
  );
}

export default Movie;
