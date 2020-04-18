import React, { useState } from 'react'
import { Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, NavbarText } from 'reactstrap'

function GlobalNavigation() {
  const [collapsed, setCollapsed] = useState<boolean>(true)
  return (
    <Navbar dark color="dark" expand="md" className="mb-3">
      <NavbarBrand href="/">Household Accounts</NavbarBrand>
      <NavbarToggler onClick={e => setCollapsed(!collapsed)} />
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink href="/records">Records</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/visualization">Visualization</NavLink>
        </NavItem>
      </Nav>
      <NavbarText>With Banksalad</NavbarText>
    </Navbar>
  )
}

export default GlobalNavigation
