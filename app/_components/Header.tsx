"use client";

import Link from "next/link";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

const navItemList = [
    {
      link: "home",
      name: "Home"
    },
    {
      link: "staking",
      name: "Staking"
    },
    {
      link: "support",
      name: "Support"
    },
  ];


export default function Header() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} href="#home">Simple Blockchain</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="#link">Home</Nav.Link>
              <Nav.Link as={Link} href="#link">Solution</Nav.Link>
              <Nav.Link as={Link} href="#link">Services</Nav.Link>
              <NavDropdown title="About" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item as={Link} href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }