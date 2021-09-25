import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import logo from "../../assets/img/sand_dunes.jpg";

const Navigation = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="sm" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={logo}
                        alt="Logo"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{" "}
                    Sandman Swap
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="base-navbar-nav" />
                <Navbar.Collapse id="base-navbar-nav">
                    <Nav>
                        <Nav.Link as={Link} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/swap">
                            Swap
                        </Nav.Link>
                        <Nav.Link as={Link} to="/pool">
                            Pool
                        </Nav.Link>
                        <Nav.Link as={Link} to="/wallet">
                            Wallet
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
