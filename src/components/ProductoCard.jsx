import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

export function ProductoCard({ producto }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Función para guardar el producto en el carrito (localStorage)
  const agregarAlCarrito = (e) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en el botón
    
    try {
      // 1. Obtenemos el carrito actual guardado
      const carritoGuardado = localStorage.getItem('carrito_bunker');
      let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
      
      // 2. Verificamos si el producto ya está en el carrito
      const existe = carrito.find(item => item.id === producto.id);
      
      if (existe) {
        // Si existe, le sumamos 1 a la cantidad
        carrito = carrito.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        // Si no existe, lo agregamos con cantidad 1
        carrito.push({ ...producto, cantidad: 1 });
      }
      
      // 3. Guardamos el carrito actualizado
      localStorage.setItem('carrito_bunker', JSON.stringify(carrito));
      
      // Opcional: Una pequeña alerta visual para el usuario
      alert(`${producto.nombre} agregado al carrito exitosamente.`);
      
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <>
      <Card 
        className="h-100 bg-dark text-white border-secondary" 
        style={{ cursor: 'pointer' }} 
        onClick={handleShow}
      >
        <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} style={{ height: '250px', objectFit: 'cover' }}/>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="text-danger">{producto.nombre}</Card.Title>
          <Card.Text className="fw-bold fs-5">${producto.precio.toLocaleString('es-CL')}</Card.Text>
          
          <Button 
            variant="danger" 
            className="mt-auto"
            onClick={agregarAlCarrito}
          >
            Agregar al Carrito
          </Button>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-dark text-danger border-secondary">
          <Modal.Title>{producto.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {producto.descripcion}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button 
            variant="danger" 
            className="mt-auto"
            onClick={agregarAlCarrito}
          >
            Agregar al Carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}