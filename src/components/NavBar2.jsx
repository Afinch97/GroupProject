import React, { useState } from 'react';
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
          <Nav.Link eventKey="link-1" href="/profile">Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Logout" onClick={() => signOut()}>
            Logout
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {children}
    </>
  );
}

export default NavBar2;
