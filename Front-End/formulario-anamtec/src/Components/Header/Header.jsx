import React from "react";
import { Navbar, Container } from "react-bootstrap";
import Logo from "../../IMG/Anamtec-logo.png"
import "./Header.css";
import "../../Styles/Paletas.css"

function Header() {
    return (
        <Navbar expand="lg" className="custom-header">
            <Container className="header-container">    
                <div className="brand-left">
                    <h1 className="brand-name">AnamTec</h1>
                    <img src= {Logo} alt="Logo" className="brand-logo" />
                </div>
                
                <Navbar.Brand className="navbar-title">
                    Formulário Anamnese
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default Header;