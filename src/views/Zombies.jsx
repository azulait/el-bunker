import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ZombiesCard } from '../components/ZombiesCard';
import React, { useState, useEffect } from 'react';

export function Zombies() {
  
  const [listaZombies, setListaZombies] = useState([]);

  useEffect(() => {
    // Petición a tu API de Spring Boot
    fetch('http://localhost:8080/api/zombie')
      .then(respuesta => respuesta.json())
      .then(datos => {
        // Guarda los datos de MySQL en el estado
        setListaZombies(datos);
      })
      .catch(error => {
        console.error("Error cargando los zombies desde la base de datos:", error);
      });
  }, []);
  
  return (
    <Container className="py-5">
      <h2 className="TituloBunker texto-verde text-center mb-3">
        LOS INFECTADOS
      </h2>
      <p className="text-center text-light mb-50 fs-50">
        "Si conoces al enemigo y te conoces a ti mismo, no debes temer el resultado de cien batallas"
      </p>
      <p className="text-center texto-amarillo mb-50 fs-50">
        - El chino del arte de la guerra.
      </p>

      <Row className="justify-content-center">
        {listaZombies.map((zombie) => (
          <Col key={zombie.id} xs={12} lg={10}>
            <ZombiesCard zombie={zombie} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}