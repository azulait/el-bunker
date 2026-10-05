import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export function NavbarBunker() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-danger">
      <Container fluid>
        <Navbar.Brand href="/">
             <span className="fs-2 text-white fuente-bunker">El Bunker</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="menu-bunker" className="border-danger" />
        
        <Navbar.Collapse id="menu-bunker">
            <Nav className="me-auto">
        {/* Usa as={Link} y to="/" en lugar de href */}
                <Nav.Link as={Link} to="/inicio">Inicio</Nav.Link>
                <Nav.Link as={Link} to="/login">Inicio de sesión</Nav.Link>
                <Nav.Link as={Link} to="/armas">Armas y Defensa</Nav.Link>
                <Nav.Link as={Link} to="/kits">Kits Médicos</Nav.Link>
                <Nav.Link as={Link} to="/raciones">Raciones y Agua</Nav.Link>
                <Nav.Link as={Link} to="/carrito">Carrito</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}