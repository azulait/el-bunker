import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';

// 1. Recibimos usuario y cerrarSesion como props
export function NavbarBunker({ usuario, cerrarSesion }) {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    if (cerrarSesion) cerrarSesion();
    navigate('/iniciar-sesion');
  };

  return (
    <Navbar className="navbar-bunker" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <span className="fs-2 text-white fuente-bunker">El Bunker</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="menu-bunker" className="border-danger" />
        
        <Navbar.Collapse id="menu-bunker">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/inicio" className="nav-link-bunker">Inicio</Nav.Link>

            {!usuario ? (
              <Nav.Link as={Link} to="/iniciar-sesion" className="nav-link-bunker">Inicio de sesión</Nav.Link>
            ) : (
              <Nav.Link onClick={handleCerrarSesion} className="nav-link-bunker text-danger">
                Cerrar Sesión ({usuario.nombre || usuario.correo})
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/categorias" className="nav-link-bunker">Categorías</Nav.Link>
            <Nav.Link as={Link} to="/zombies" className="nav-link-bunker">Guia de Zombies</Nav.Link>
            <Nav.Link as={Link} to="/carrito" className="nav-link-bunker">Carrito</Nav.Link>

            {usuario?.esAdmin && (
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className="nav-link-bunker texto-amarillo fw-bold border border-warning px-2 rounded ms-lg-2"
              >
              Panel Admin
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}