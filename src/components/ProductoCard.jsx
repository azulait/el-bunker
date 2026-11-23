import { useState } from 'react';
import { Card, Modal } from 'react-bootstrap';

export function ProductoCard({ producto }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const agregarAlCarrito = (e) => {
    e.stopPropagation(); 
    
    try {
      const carritoGuardado = localStorage.getItem('carrito_bunker');
      let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
      
      const existe = carrito.find(item => item.id === producto.id);
      
      if (existe) {
        carrito = carrito.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }
      
      localStorage.setItem('carrito_bunker', JSON.stringify(carrito));
      alert(`${producto.nombre} agregado al carrito exitosamente.`);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <>
      {/* Reemplazamos bg-dark y border-secondary por tu clase card-estilos */}
      <Card 
        className="card-estilos h-100 text-center" 
        style={{ cursor: 'pointer' }} 
        onClick={handleShow}
      >
        {/* Aplicamos img-estilos para el fondo oscuro y borde inferior en la imagen */}
        <Card.Img 
          variant="top" 
          src={producto.imagen} 
          alt={producto.nombre} 
          className="img-estilos"
          style={{ height: '250px', objectFit: 'contain' }} 
        />
        <Card.Body className="d-flex flex-column">
          {/* Título del producto usando la fuente temática pero con un tamaño controlado */}
          <Card.Title 
            className="texto-rojo mb-3" 
            style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2rem', letterSpacing: '2px' }}
          >
            {producto.nombre.toUpperCase()}
          </Card.Title>
          
          <Card.Text className="texto-blanco fw-bold mb-4" style={{ fontSize: '1.5rem', fontFamily: 'sans-serif' }}>
            ${producto.precio.toLocaleString('es-CL')}
          </Card.Text>
          
          {/* Reemplazamos Button variant="danger" por el botón html con tu clase btn-estilos */}
          <button 
            className="btn btn-estilos mt-auto w-100 p-2 fs-5"
            onClick={agregarAlCarrito}
          >
            AÑADIR AL CARRITO
          </button>
        </Card.Body>
      </Card>

      {/* contentClassName aplica tu modal-estilos (borde y sombra roja) al contenedor interno del modal */}
      <Modal show={show} onHide={handleClose} centered contentClassName="modal-estilos">
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-danger">
          <Modal.Title 
            className="texto-rojo" 
            style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2.5rem', letterSpacing: '2px' }}
          >
            {producto.nombre.toUpperCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="texto-blanco" style={{ fontFamily: 'sans-serif', fontSize: '1.2rem' }}>
          {producto.descripcion}
        </Modal.Body>
        <Modal.Footer className="border-top border-danger">
          <button 
            className="btn btn-estilos w-100 p-2 fs-5"
            onClick={agregarAlCarrito}
          >
            AÑADIR AL CARRITO
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}