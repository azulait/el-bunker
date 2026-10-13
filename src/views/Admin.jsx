import React, { useState } from 'react';
import { Container, Card, Tabs, Tab } from 'react-bootstrap';
import { CrudZombies } from '../components/CrudZombies';
import { CrudProductos } from '../components/CrudProductos';
import { CrudUsuarios } from '../components/CrudUsuarios';

export function Admin() {
  const [pestañaActiva, setPestañaActiva] = useState('usuarios');

  return (
    <Container className="py-5 text-white">
      <h1 className="text-center texto-rojo fuente-bunker mb-4">PANEL DE CONTROL ADMIN</h1>
      
      <Card className="bg-dark text-white border-danger shadow-lg p-3">
        <Tabs
          id="admin-tabs"
          activeKey={pestañaActiva}
          onSelect={(k) => setPestañaActiva(k)}
          className="mb-3"
          variant="pills"
        >
          <Tab eventKey="usuarios" title="Gestión de Usuarios">
            <div className="p-3 border border-secondary rounded mt-2">
              <h3 className="texto-amarillo">CRUD de Usuarios</h3>
              <p><CrudUsuarios /></p>
            </div>
          </Tab>

          <Tab eventKey="productos" title="Gestión de Productos">
            <div className="p-3 border border-secondary rounded mt-2">
              <h3 className="texto-amarillo">CRUD de Productos</h3>
              <p><CrudProductos /></p>
            </div>
          </Tab>

          <Tab eventKey="zombies" title="Blog de Zombies">
            <div className="p-3 border border-secondary rounded mt-2">
              <h3 className="texto-amarillo">CRUD de Zombies</h3>
              <p><CrudZombies /></p>
            </div>
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
}

export default Admin;