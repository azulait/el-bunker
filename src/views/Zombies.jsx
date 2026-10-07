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
        Archivo de Mutaciones
      </h2>
      <p className="text-center text-light mb-5 fs-5">
        Conoce a tus enemigos. Haz clic en cada expediente para leer la bitácora completa.
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