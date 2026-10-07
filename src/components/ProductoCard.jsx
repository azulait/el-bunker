import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

export function ProductoCard({ producto }) {
  // Estado para controlar la visibilidad del Modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Se agrega onClick y cursor pointer para que la card sea clickeable */}
      <Card 
        className="h-100 bg-dark text-white border-secondary" 
        style={{ cursor: 'pointer' }} 
        onClick={handleShow}
      >
        <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="text-danger">{producto.nombre}</Card.Title>
          <Card.Text className="fw-bold fs-5">${producto.precio.toLocaleString('es-CL')}</Card.Text>
          
          <Button 
            variant="danger" 
            className="mt-auto"
            onClick={(e) => {
              // Evita que el clic en el botón abra también el Modal de la Card
              e.stopPropagation(); 
              console.log("Agregado al carrito:", producto.nombre);
            }}
          >
            Agregar al Carrito
          </Button>
        </Card.Body>
      </Card>

      {/* Ventana emergente (Modal) */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-dark text-danger">
          <Modal.Title>{producto.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {/* Se utiliza la propiedad 'descripcion' de tu base de datos */}
          {producto.descripcion}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button 
            variant="danger" 
            className="mt-auto"
            onClick={(e) => {
              // Evita que el clic en el botón abra también el Modal de la Card
              e.stopPropagation(); 
              console.log("Agregado al carrito:", producto.nombre);
            }}
          >
            Agregar al Carrito
          </Button>
          
        </Modal.Footer>
      </Modal>
    </>
  );
}