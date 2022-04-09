import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Navbar, Nav, Form, FormControl, Button, Container,
} from 'react-bootstrap';
import { useAuth } from './Auth';
import './NavBar.css';

function NavBar() {
  const [term, setTerm] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const Submit = (e) => {
    e.preventDefault();
    // navigate(`/searchy/${term}`)
    window.location = `/${term}`;
  };
  const handleSelect = (eventKey) => {
    navigate(eventKey);
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            variant="pills"
            defaultActiveKey={location.pathname}
            onSelect={handleSelect}
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Item>
              <Nav.Link eventKey="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="/searchy">Searchy</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="/favorites">Favorites</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="" href="https://github.com/Afinch97/GroupProject" target="_blank" rel="noreferrer">Github Link</Nav.Link>
            </Nav.Item>
          </Nav>
          <Form className="d-flex" onSubmit={Submit}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setTerm(e.target.value)}
              value={term}
            />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>
          <Button variant="danger" onClick={signOut}>Logout</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
