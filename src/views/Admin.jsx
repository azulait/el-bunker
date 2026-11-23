import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { CrudZombies } from '../components/CrudZombies';
import { CrudProductos } from '../components/CrudProductos';
import { CrudUsuarios } from '../components/CrudUsuarios';

export function Admin() {
  const [pestañaActiva, setPestañaActiva] = useState('usuarios');

  return (
    <Container className="py-5">
      <h1 
        className="TituloZombie texto-rojo text-center mb-5" 
        style={{ fontSize: '4rem', letterSpacing: '3px' }}
      >
        SISTEMA CENTRAL - NIVEL ADMIN
      </h1>
      
      <div className="panel-bunker p-4 p-md-5 shadow-lg">
        
        <Nav
          variant="pills"
          activeKey={pestañaActiva}
          onSelect={(k) => setPestañaActiva(k)}
          className="justify-content-center mb-4 gap-3 border-bottom border-danger pb-4"
        >
          <Nav.Item>
            <Nav.Link 
              eventKey="usuarios" 
              className={`btn-categoria ${pestañaActiva === 'usuarios' ? 'active' : ''}`}
            >
              SUPERVIVIENTES
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="productos" 
              className={`btn-categoria ${pestañaActiva === 'productos' ? 'active' : ''}`}
            >
              SUMINISTROS
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="zombies" 
              className={`btn-categoria ${pestañaActiva === 'zombies' ? 'active' : ''}`}
            >
              ARCHIVOS INFECTADOS
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="mt-4">
          {pestañaActiva === 'usuarios' && (
            <div>
              <h3 
                className="texto-amarillo mb-4" 
                style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2.5rem', letterSpacing: '2px' }}
              >
                GESTIÓN DE PERSONAL REGISTRADO
              </h3>
              <CrudUsuarios />
            </div>
          )}

          {pestañaActiva === 'productos' && (
            <div>
              <h3 
                className="texto-amarillo mb-4" 
                style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2.5rem', letterSpacing: '2px' }}
              >
                CONTROL DE INVENTARIO
              </h3>
              <CrudProductos />
            </div>
          )}

          {pestañaActiva === 'zombies' && (
            <div>
              <h3 
                className="texto-amarillo mb-4" 
                style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2.5rem', letterSpacing: '2px' }}
              >
                BASE DE DATOS DE AMENAZAS
              </h3>
              <CrudZombies />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
export default Admin;

//admin@elbunker.cl
//admin123