import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

function GlobalNavigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-3">
      <Navbar.Brand href="/">Household Accounts</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" navbar>
          <Nav.Link href="/records">Records</Nav.Link>
          <Nav.Link href="/visualization">Visualization</Nav.Link>
        </Nav>
        <Navbar.Text>With Banksalad</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default GlobalNavigation
