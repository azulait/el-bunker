import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export function ZombiesCard({ zombie }) {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate(`/zombie/${zombie.id}`);
  };

  return (
    <Card 
      className="card-estilosZ mb-4 text-white" 
      style={{ cursor: 'pointer', overflow: 'hidden' }} 
      onClick={handleClick}
    >
      <Row className="g-0 h-100">
        <Col md={4}>
          <Card.Img 
            src={zombie.imagen} 
            alt={zombie.nombre} 
            className="img-estilos"
          />
        </Col>
        <Col md={8}>
          <Card.Body className="d-flex flex-column h-100">
            <Card.Title className="texto-verde fuente-bunker TituloZombie">
              {zombie.nombre}
            </Card.Title>
            <Card.Text className="fs-3">
              <span className="texto-amarillo">NIVEL DE PELIGRO: </span>
              <span className="texto-rojo">{zombie.categoria}</span>
            </Card.Text>
            <Card.Text>
              {zombie.descripcion}
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}