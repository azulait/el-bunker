import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function ZombiesCard({ zombie }) {
  const navigate = useNavigate(); // Hook para cambiar de página

  const handleClick = () => {
    // Redirige a la ruta del zombie usando su ID
    navigate(`/zombie/${zombie.id}`);
  };

  return (
    <Card 
      className="card-estilosZ mb-4 text-white" 
      style={{ cursor: 'pointer', overflow: 'hidden' }} 
      onClick={handleClick}
    >
      <Row className="g-0">
        <Col md={4}>
          <Card.Img 
            src={zombie.imagen} 
            alt={zombie.nombre} 
            className="img-estilos h-100"
            style={{ objectFit: 'cover' }} 
          />
        </Col>
        <Col md={8}>
          <Card.Body className="d-flex flex-column h-100">
            <Card.Title className="texto-verde fuente-bunker TituloZombie">
              {zombie.nombre}
            </Card.Title>
            <Card.Text className="fs-3">
              <span className="texto-amarillo">NIVEL DE PELIGRO: </span>
              <span className="texto-rojo">BAJO</span>
            </Card.Text>
            <Card.Text>
              {zombie.descripcion}
            </Card.Text>
            <small className="mt-auto texto-verde fw-bold">
              Haz clic para leer la bitácora completa...
            </small>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}