import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function ZombiesCard({ zombie }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Tarjeta alargada (Horizontal) */}
      <Card 
        className="bg-dark text-white border-secondary mb-3" 
        style={{ cursor: 'pointer', overflow: 'hidden' }} 
        onClick={handleShow}
      >
        <Row className="g-0">
          {/* Columna para la imagen (ocupa 4 de 12 espacios) */}
          <Col md={4}>
            <Card.Img 
              src={zombie.imagen} 
              alt={zombie.nombre} 
              style={{ height: '100%', objectFit: 'cover' }} 
            />
          </Col>
          {/* Columna para el texto breve (ocupa 8 de 12 espacios) */}
          <Col md={8}>
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title className="text-success fs-3">{zombie.nombre}</Card.Title>
              <Card.Text className="text-muted fst-italic">
                Clasificación: {zombie.categoria}
              </Card.Text>
              <Card.Text>
                {zombie.descripcion}
              </Card.Text>
              {/* Indicador visual de que se puede clickear en lugar de un botón */}
              <small className="mt-auto text-success fw-bold">
                Clic para leer el archivo completo...
              </small>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Modal Grande (size="lg") tipo Blog */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title className="text-success fs-2">Expediente: {zombie.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          
        
          <div className="text-center mb-4">
            {/* Aquí usamos el GIF que agregaste en tu base de datos */}
            <img 
              src={zombie.gif || zombie.imagen} 
              alt={`Animación de ${zombie.nombre}`} 
              className="img-fluid rounded border border-secondary"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
          </div>
        
          
          <h4 className="text-danger border-bottom border-secondary pb-2">Archivo del Sobreviviente</h4>
          
          {/* Aquí mostramos el texto extenso del blog */}
          <p className="fs-5 mt-3" style={{ lineHeight: '1.8' }}>
            {zombie.blog}
          </p>
          
        </Modal.Body>
      </Modal>
    </>
  );
}