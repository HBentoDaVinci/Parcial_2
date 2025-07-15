import React, {useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

function Header(){

    const {user, logout} = useContext(AuthContext)
    console.log('user', user)

    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate('/admin/login')
    }

    return (
        <div className="header">
            <Navbar expand="lg">
                <Container className="border-bottom">
                    <Navbar.Brand href={"/"}>
                        <div className="d-flex text-start">
                            <img alt="Prepaga Salud" src={logo} width="40" height="40" className="d-inline-block align-middle me-2"/>
                            <div>
                                <h1 className="mb-0 h2">PrePaga Salud</h1>
                                <p className="mb-0 small">Tenemos un plan de salud a su medida</p>
                            </div>
                            </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <NavLink to="/" className="nav-link">Inicio</NavLink>
                        <NavLink to="/cotizador" className="nav-link">Cotizador</NavLink>
                        <NavLink to="/planes" className="nav-link">Planes</NavLink>
                    </Nav>
                    <NavDropdown title="Admin" id="basic-nav-dropdown">
                        <NavLink to="/admin/login" className="dropdown-item">Login</NavLink>
                        <Button onClick={()=>{logoutHandler()}} className="dropdown-item">Logout</Button>
                        <NavDropdown.Divider />
                        <NavLink to="/admin/planes" className="dropdown-item">Planes</NavLink>
                        <NavLink to="/admin/prepagas" className="dropdown-item">Prepagas</NavLink>
                        <NavLink to="/admin/usuarios" className="dropdown-item">Usuarios</NavLink>
                    </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}
export default Header