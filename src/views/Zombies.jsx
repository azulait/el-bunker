import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Importamos el componente de la tarjeta
import { ZombiesCard } from '../components/ZombiesCard';
// Importamos la base de datos de los zombies
import { ZombiesBunker } from '../data/zombies';

export function Zombies() {
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
        {ZombiesBunker.map((zombie) => (
          <Col key={zombie.id} xs={12} lg={10}>
            <ZombiesCard zombie={zombie} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}