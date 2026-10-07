import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export function NavbarBunker() {
  return (
    <Navbar className="navbar-bunker">
      <Container fluid>
        <Navbar.Brand href="/">
             <span className="fs-2 text-white fuente-bunker">El Bunker</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="menu-bunker" className="border-danger" />
        
        <Navbar.Collapse id="menu-bunker">
            <Nav className="me-auto">
        {/* Usa as={Link} y to="/" en lugar de href */}
                <Nav.Link as={Link} to="/inicio" className="nav-link-bunker">Inicio</Nav.Link>
                <Nav.Link as={Link} to="/login" className="nav-link-bunker">Inicio de sesión</Nav.Link>
                <Nav.Link as={Link} to="/categorias" className="nav-link-bunker">Categorías</Nav.Link>
                <Nav.Link as={Link} to="/zombies" className="nav-link-bunker">Guia de Zombies</Nav.Link>
                <Nav.Link as={Link} to="/carrito" className="nav-link-bunker">Carrito</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}