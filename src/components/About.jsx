/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const [user, setUser] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    // console.log(JSON.stringify(user));
    fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        const key = Object.keys(json);
        // console.log(key[0]);
        if (key[0] === 'success') {
          // return <Navigate to="/login" />;
          navigate('/login');
        } if (key[0] === 'error') {
          setError(Object.values(json));
        }
      });
  };

  return (
    <>
      <div className="error"><p>{error}</p></div>
      <form onSubmit={submit}>
        <label htmlFor="user">Name: </label>
        <input type="text" name="user" id="user" onChange={(e) => setUser({ ...user, username: e.target.value })} value={user.username} />

        <label htmlFor="user">Password: </label>
        <input type="password" name="password" id="password" onChange={(e) => setUser({ ...user, password: e.target.value })} value={user.password} />

        <label className="checkbox">
          <input type="checkbox" name="remember" value={user.remember} onChange={() => setUser({ ...user, remember: !user.remember })} />
          Remember me
        </label>
        <input type="submit" name="Sign Up" />
      </form>
    </>
  );
}
export default About;
