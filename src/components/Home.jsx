/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './Auth';
import './homeStyle.css';

function Home() {
  const [user, setUser] = useState({ username: '', password: '', remember: false });
  const { signIn, authError } = useAuth();
  const submit = (e) => {
    e.preventDefault();
    signIn(user);
  };

  return (
    <div className="inner">
      <form onSubmit={submit}>
        <h3>Sign In</h3>
        <div className="error"><p>{authError}</p></div>
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
            <input type="checkbox" className="custom-control-input" id="remember" value={user.remember} onChange={() => setUser({ ...user, remember: !user.remember })} />
            <label className="custom-control-label" htmlFor="remember"> Remember me</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Submit</button>
      </form>
      <br />
      <p>
        Don&apos;t have an account?
        <br />
        <Link className="btn btn-secondary btn-sm" role="button" to="/register">Register</Link>
        <Link className="btn btn-secondary btn-sm" role="button" to="/auth">Auth</Link>
      </p>
    </div>

  );
}
export default Home;
