import { Button } from 'bootstrap';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './homeStyle.css';

function Home() {
  const [user, setUser] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const Submit = (e) => {
    e.preventDefault();
    console.log(JSON.stringify(user));
    fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        const key = Object.keys(json);
        console.log(key[0]);
        if (key[0] === 'success') {
          navigate('/searchy');
        } else if (key[0] === 'error') {
          console.log(Object.values(json));
          setError(Object.values(json));
        }
      });
  };

  return (
    <div className="inner">
      <form onSubmit={Submit}>
        <h3>Sign In</h3>
        <div className="error"><p>{error}</p></div>
        <div className="form-group">
          <label htmlFor="user">Username/Email: </label>
          <input type="text" className="form-control" id="user" placeholder="Username or Email" onChange={(e) => setUser({ ...user, username: e.target.value })} value={user.username} />
        </div>
        <div className="form-group">
          <label htmlFor="user">Password: </label>
          <input type="password" className="form-control" placeholder="Password" id="password" onChange={(e) => setUser({ ...user, password: e.target.value })} value={user.password} />
        </div>
        <div className="form-group">
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="remember" value={user.remember} onChange={(e) => setUser({ ...user, remember: !user.remember })} />
            <label className="custom-control-label" htmlFor="remember"> Remember me</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Submit</button>
      </form>
      <br />
      <p>
        Don&apos;t have an account?
        {' '}
        <br />
        <Link className="btn btn-secondary btn-sm" role="button" to="/register">Register</Link>
      </p>
    </div>

  );
}
export default Home;
