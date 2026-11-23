import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

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
          
          <Nav className="me-auto align-items-lg-center">
            <Nav.Link as={Link} to="/inicio" className="nav-link-bunker">Inicio</Nav.Link>
            
            <Nav.Link as={Link} to="/categorias" className="nav-link-bunker">Productos</Nav.Link>
            
            <Nav.Link as={Link} to="/zombies" className="nav-link-bunker">Guía de Zombies</Nav.Link>
            <Nav.Link as={Link} to="/carrito" className="nav-link-bunker">Carrito</Nav.Link>

            {usuario?.esAdmin && (
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className="btn btn-estilos text-white ms-lg-3 my-2 my-lg-0 px-4"
                style={{ fontSize: '1rem' }}
              >
                PANEL ADMIN
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto align-items-lg-center gap-3 mt-3 mt-lg-0">
            {!usuario ? (
              <Nav.Link as={Link} to="/iniciar-sesion" className="btn btn-estilos px-4">
                Iniciar Sesión
              </Nav.Link>
            ) : (
              <>
                <div className="d-flex align-items-center gap-2 px-2">
                  {usuario.avatar && (
                    <img 
                      src={usuario.avatar} 
                      alt="Avatar" 
                      style={{ width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #dc3545' }} 
                    />
                  )}
                  <span className="texto-verde fw-bold" style={{ fontFamily: 'sans-serif', fontSize: '1.1rem' }}>
                    SUPERVIVIENTE: {usuario.nombre || usuario.correo}
                  </span>
                </div>
                
                <button 
                  onClick={handleCerrarSesion} 
                  className="btn btn-outline-danger btn-sm px-3"
                  style={{ fontWeight: 'bold' }}
                >
                  CERRAR SESIÓN
                </button>
              </>
            )}
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}