import React from "react";
import { Navbar, Container } from "react-bootstrap";
import Logo from "../../IMG/AnamTec.png"
import "./Header.css";

function Header() {
    return (
        <Navbar expand="lg" className="custom-header">
            <Container className="justify-content-between align-items-center">
                <img src= {Logo} alt="Logo" className="logo-left" />
                <Navbar.Brand className="navbar-title mx-auto">
                    Formulário Anamnese
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default Header;