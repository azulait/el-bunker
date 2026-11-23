import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

export function ZombiesCard({ zombie }) {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate(`/zombie/${zombie.id}`);
  };

  return (
    <Card 
      className="card-estilosZ mb-4" 
      onClick={handleClick}
    >
      <Row className="g-0 h-100">
        <Col md={4} className="h-100 d-flex align-items-center">
          <Card.Img 
            src={zombie.imagen} 
            alt={zombie.nombre} 
            className="img-estilos"
            style={{ 
              height: '100%', 
              width: '100%', 
              objectFit: 'contain', /* Esto evita que la imagen se corte */
              objectPosition: 'center', /* Esto la centra perfectamente */
              padding: '15px' /* Un poco de respiro alrededor de la imagen */
            }}
          />
        </Col>
        
        {/* Columna de la Información */}
        <Col md={8}>
          {/* Añadimos p-4 para que el texto respire y no quede pegado a los bordes */}
          <Card.Body className="d-flex flex-column h-100 p-4">
            
            {/* Título en verde, fuente Shlop, tamaño ajustado */}
            <Card.Title 
              className="texto-verde mb-2"
              style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '4.5rem', letterSpacing: '2px', lineHeight: '1' }}
            >
              {zombie.nombre.toUpperCase()}
            </Card.Title>
            
            {/* Nivel de peligro manteniendo la fuente Shlop para impacto visual */}
            <div 
              className="mb-4" 
              style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2.5rem', letterSpacing: '1px' }}
            >
              <span className="texto-amarillo">NIVEL DE PELIGRO: </span>
              <span className="texto-rojo">{zombie.categoria ? zombie.categoria.toUpperCase() : 'DESCONOCIDO'}</span>
            </div>
            
            {/* Descripción en sans-serif para garantizar que los textos largos se lean sin esfuerzo */}
            <Card.Text 
              className="texto-blanco"
              style={{ fontFamily: 'sans-serif', fontSize: '1.2rem', lineHeight: '1.6', overflowY: 'auto' }}
            >
              {zombie.descripcion}
            </Card.Text>

          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}