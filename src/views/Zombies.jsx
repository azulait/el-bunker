import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ZombiesBunker } from '../data/zombies';
import { ZombiesCard } from '../components/ZombiesCard';
import React, { useState, useEffect } from 'react';

export function Zombies() {
  
  const [listaZombies, setListaZombies] = useState([]);

  useEffect(() => {
    // 1. Intenta leer del localStorage
    const zombiesGuardados = JSON.parse(localStorage.getItem('zombies_bunker'));
    
    if (zombiesGuardados && zombiesGuardados.length > 0) {
      // 2. Si hay datos guardados (modificados por el admin), úsalos
      setListaZombies(zombiesGuardados);
    } else {
      // 3. Si no hay nada en localStorage, usa el archivo original por defecto
      setListaZombies(ZombiesBunker);
    }
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