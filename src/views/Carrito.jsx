import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert } from 'react-bootstrap';
import { productosBunker } from '../data/productos';

export default function Carrito() {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito_bunker');
    if (carritoGuardado) {
      try {
        return JSON.parse(carritoGuardado);
      } catch (e) {
        console.error("Error al leer localStorage", e);
      }
    }
    return [
      { ...productosBunker[0], cantidad: 1 },
      { ...productosBunker[1], cantidad: 1 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('carrito_bunker', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item
      )
    );
  };

  const eliminarProducto = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <Container className="my-4">
      <Alert variant="info" dismissible className="mb-4">
        <strong>¡Hola bienvenido a carrito!</strong> En esta vista puedes administrar y determinar que deseas comprar en nuestra tienda
      </Alert>

      <Row>
        {/* lado izquierdo de la pagina */}
        <Col lg={6} md={12} className="mb-4">
          <h3 className="mb-3 text-white">Lista de productos</h3>
          <Row xs={1} sm={2} md={3} className="g-3">
            {productosBunker.map((prod) => (
              <Col key={prod.id}>
                <Card className="h-100 text-center shadow-sm bg-dark text-white border-secondary">
                  <Card.Img
                    variant="top"
                    src={prod.imagen}
                    style={{ height: '100px', objectFit: 'contain', padding: '5px' }}
                  />
                  <Card.Body className="d-flex flex-column justify-content-between p-2">
                    <Card.Title style={{ fontSize: '0.85rem' }}>{prod.nombre}</Card.Title>
                    <div>
                      <div className="fw-bold text-danger mb-2">
                        ${prod.precio.toLocaleString()}
                      </div>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="w-100"
                        onClick={() => agregarAlCarrito(prod)}
                      >
                        Añadir
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* lado derecho de la pagina */}
        <Col lg={6} md={12}>
          <h3 className="mb-3 text-white">Carrito de Compras</h3>
          <Card className="shadow-sm p-3 bg-dark text-white border-secondary">
            <Table responsive borderless align="middle" variant="dark" className="mb-3">
              <thead>
                <tr className="border-bottom border-secondary">
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      El carrito está vacío, haz clic en "Añadir" en algún producto
                    </td>
                  </tr>
                ) : (
                  carrito.map((item) => (
                    <tr key={item.id} className="border-bottom border-secondary">
                      <td>
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          style={{ width: '35px', height: '35px', objectFit: 'contain' }}
                        />
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{item.nombre}</td>
                      <td style={{ fontSize: '0.8rem' }}>${item.precio.toLocaleString()}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            style={{ padding: '0px 5px', fontSize: '0.7rem' }}
                            onClick={() => cambiarCantidad(item.id, -1)}
                          >
                            -
                          </Button>
                          <span style={{ fontSize: '0.8rem' }}>{item.cantidad}</span>
                          <Button
                            variant="outline-success"
                            size="sm"
                            style={{ padding: '0px 5px', fontSize: '0.7rem' }}
                            onClick={() => cambiarCantidad(item.id, 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ fontSize: '0.7rem' }}
                          onClick={() => eliminarProducto(item.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <div className="d-flex flex-column align-items-end gap-2 mt-2">
              <div className="fs-5 fw-bold">
                Total: <span className="text-danger">${total.toLocaleString()}</span>
              </div>
              <div className="d-flex gap-2">
                <Button variant="secondary" size="sm" onClick={limpiarCarrito}>
                  Limpiar
                </Button>
                <Button variant="success" size="sm">
                  Comprar ahora
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}