import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ZombiesCard } from '../components/ZombiesCard';

export function Zombies() {
  const [listaZombies, setListaZombies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/zombie')
      .then(respuesta => respuesta.json())
      .then(datos => {
        setListaZombies(datos);
      })
      .catch(error => {
        console.error("Error cargando los zombies desde la base de datos:", error);
      });
  }, []);
  
  return (
    <Container className="mt-5 py-4 text-center">
      <h2 className="TituloBunker texto-verde mb-4" style={{ fontSize: '5rem' }}>
        LOS INFECTADOS
      </h2>
      
      <div className="mb-5">
        <p 
          className="texto-blanco mb-2" 
          style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2.5rem', letterSpacing: '2px' }}
        >
          "SI CONOCES AL ENEMIGO Y TE CONOCES A TI MISMO, NO DEBES TEMER EL RESULTADO DE CIEN BATALLAS"
        </p>
        <p 
          className="texto-amarillo" 
          style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2rem', letterSpacing: '2px' }}
        >
          - EL CHINO DEL ARTE DE LA GUERRA.
        </p>
      </div>

      <Row className="justify-content-center g-5">
        {listaZombies.map((zombie) => (
          <Col key={zombie.id} xs={12} lg={10}>
            <ZombiesCard zombie={zombie} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}