import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { removeMovieFavorite, addMovieFavorite } from '../fetcher';

export async function toggleFavorite(isFavorite, id) {
  if (isFavorite) {
    await removeMovieFavorite(id);
  } else {
    await addMovieFavorite(id);
  }
}

function MovieTile({ movie, userFavorite }) {
  const [isFavorite, setFavorite] = useState(Boolean(userFavorite));
  const { title, image_url, id } = movie;
  const buttonText = isFavorite ? 'Unfavorite' : 'Favorite';
  const handleClick = async () => {
    await toggleFavorite(isFavorite, id);
    setFavorite(!isFavorite);
  };

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={`${image_url}`} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the bulk of
          the card&apos;s content.
        </Card.Text>
        <Button variant="primary" onClick={handleClick}>{buttonText}</Button>
      </Card.Body>
    </Card>
  );
}

export default MovieTile;
