"use client";
import Link from "next/link";
import Image from 'next/image';
import TOKAMAK_ICON from '@/public/assets/TokamakLogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Fragment } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';

const navItemList = [
    {
      type: "single",
      link: "",
      name: "Home"
    },
    {
      type: "single",
      link: "solution",
      name: "Solution"
    },
    {
      type: "single",
      link: "services",
      name: "Services"
    },
    {
      type: "dropdown",
      name: "Community",
      dropDownList: [
        {
          link: "forum",
          name: "Forum"
        },
        {
          link: "notice",
          name: "Notice"
        },
        {
          link: "about",
          name: "About"
        }
      ]
    },
  ];


export default function Header() {

    const { data: session } = useSession();

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} href="/">
            <div className="fw-bolder"><Image src={TOKAMAK_ICON} alt="" className="logo"/> Simple Blockchain</div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {
                navItemList.map((navList, index: number) =>
                navList.type === "single"
                  ? <Nav.Link as={Link} href={"/"+navList.link} key={navList.link}>{navList.name}</Nav.Link>
                  : 
                  (
                    navList.type === "dropdown" && navList.dropDownList
                   ?
                  <NavDropdown title="Community" id="basic-nav-dropdown" key={index}>
                    {
                      navList.dropDownList.map((dropDownList, index2: number) => 
                        dropDownList.name === "About"
                        ?
                        <Fragment key={index2}>
                          <NavDropdown.Divider />
                          <NavDropdown.Item as={Link} href={"/"+dropDownList.link} key={dropDownList.link}>{dropDownList.name}</NavDropdown.Item>  
                        </Fragment>
                        :
                        <NavDropdown.Item as={Link} href={"/"+dropDownList.link} key={dropDownList.link}>{dropDownList.name}</NavDropdown.Item>     
                      )
                    }
                  </NavDropdown>
                   :null              
                  )                  
                )
              }
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            {
              session && session.user
              ?
              <NavDropdown title={<FontAwesomeIcon icon={faUser} />} id="basic-nav-dropdown1">
                <NavDropdown.Item as={Link} href="">Mypage</NavDropdown.Item>
                <NavDropdown.Divider />  
                <NavDropdown.Item onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</NavDropdown.Item>
              </NavDropdown>
              :
              <>
                <Nav.Link as={Link} href="/signup">Signup</Nav.Link>
                <Nav.Link as={Link} href="/signin">Login</Nav.Link>
              </>
            }            
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
    )
  }