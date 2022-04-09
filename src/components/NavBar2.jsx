import React from 'react';
import { Nav } from 'react-bootstrap';
import { useAuth } from './Auth';

function NavBar2({ children }) {
  const { signOut } = useAuth();
  return (
    <>
      <Nav
        activeKey="/home"
      >
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/profile">Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/movies">Movies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/favorites">Favorites</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => signOut()}>
            Logout
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {children}
    </>
  );
}

export default NavBar2;
