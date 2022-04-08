/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './Auth';
import './homeStyle.css';

function Home() {
  const { user } = useAuth();

  const welcomeMessage = `Welcome ${user.username}!`;
  return (
    <div className="inner">
      <h1> Home Page!</h1>
      <div>
        {welcomeMessage}
      </div>
      <div>{`user: ${JSON.stringify(user)}`}</div>
    </div>

  );
}
export default Home;
