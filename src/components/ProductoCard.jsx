import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export function ProductoCard({ producto }) {
  return (
    <Card className="h-100 bg-dark text-white border-secondary">
      <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-danger">{producto.nombre}</Card.Title>
        <Card.Text>{producto.descripcion}</Card.Text>
        <Card.Text className="fw-bold fs-5">${producto.precio.toLocaleString('es-CL')}</Card.Text>
        <Button variant="danger" className="mt-auto">Agregar al Carrito</Button>
      </Card.Body>
    </Card>
  );
}