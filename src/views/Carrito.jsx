import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Carrito() {
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState([]);

  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito_bunker');
    if (carritoGuardado) {
      try {
        return JSON.parse(carritoGuardado);
      } catch (e) {
        console.error("Error al leer localStorage", e);
      }
    }
    return []; 
  });

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/producto');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error obteniendo los productos:", error);
      }
    };

    fetchProductos();
  }, []);

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
    <Container className="my-5">
      <div className="panel-bunker p-3 mb-5 text-center" style={{ borderLeft: '5px solid #dc3545' }}>
        <p className="texto-blanco mb-0 fs-5" style={{ fontFamily: 'sans-serif' }}>
          <strong className="texto-rojo">¡SISTEMA DE SUMINISTROS ACTIVO!</strong> Selecciona el equipamiento necesario para tu supervivencia.
        </p>
      </div>

      <Row className="g-4">
        <Col lg={6} md={12}>
          <h3 className="TituloZombie texto-rojo mb-4 text-center" style={{ fontSize: '3rem' }}>
            ARSENAL DISPONIBLE
          </h3>
          <Row xs={1} sm={2} md={3} className="g-3">
            {productos.map((prod) => (
              <Col key={prod.id}>
                <Card className="card-estilos h-100 text-center shadow-sm">
                  <Card.Img
                    variant="top"
                    src={prod.imagen}
                    className="img-estilos"
                    style={{ height: '100px', objectFit: 'contain', padding: '10px' }}
                  />
                  <Card.Body className="d-flex flex-column justify-content-between p-2">
                    <Card.Title className="texto-blanco" style={{ fontSize: '0.85rem', fontFamily: 'sans-serif' }}>
                      {prod.nombre.toUpperCase()}
                    </Card.Title>
                    <div>
                      <div className="texto-rojo fw-bold mb-2">
                        ${prod.precio.toLocaleString()}
                      </div>
                      <button
                        className="btn btn-estilos w-100"
                        style={{ fontSize: '0.8rem', padding: '5px' }}
                        onClick={() => agregarAlCarrito(prod)}
                      >
                        AÑADIR
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col lg={6} md={12}>
          <h3 className="TituloZombie texto-verde mb-4 text-center" style={{ fontSize: '3rem' }}>
            TU MOCHILA
          </h3>
          <div className="panel-bunker p-4 shadow-sm">
            <Table responsive borderless align="middle" className="texto-blanco mb-3" style={{ fontFamily: 'sans-serif' }}>
              <thead>
                <tr className="border-bottom border-danger">
                  <th>Img</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th className="text-center">Cant.</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 texto-amarillo">
                      Tu mochila está vacía. Añade suministros antes de salir.
                    </td>
                  </tr>
                ) : (
                  carrito.map((item) => (
                    <tr key={item.id} className="border-bottom" style={{ borderColor: '#333' }}>
                      <td>
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#0d0d0d', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{item.nombre.toUpperCase()}</td>
                      <td style={{ fontSize: '0.85rem' }}>${item.precio.toLocaleString()}</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            style={{ padding: '0px 8px', fontWeight: 'bold' }}
                            onClick={() => cambiarCantidad(item.id, -1)}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                          <button
                            className="btn btn-outline-success btn-sm"
                            style={{ padding: '0px 8px', fontWeight: 'bold' }}
                            onClick={() => cambiarCantidad(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="texto-rojo fw-bold" style={{ fontSize: '0.85rem' }}>
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                          onClick={() => eliminarProducto(item.id)}
                          title="Descartar"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <div className="d-flex flex-column align-items-end gap-3 mt-4 border-top border-danger pt-3">
              <div className="texto-blanco" style={{ fontSize: '1.5rem', fontFamily: 'sans-serif' }}>
                TOTAL: <span className="texto-rojo fw-bold">${total.toLocaleString()}</span>
              </div>
              <div className="d-flex gap-3 w-100 justify-content-end">
                <button 
                  className="btn btn-outline-secondary text-white px-3" 
                  onClick={limpiarCarrito}
                >
                  VACIAR MOCHILA
                </button>
                <button
                  className="btn btn-estilos px-4"
                  onClick={() => navigate('/checkout')}
                  disabled={carrito.length === 0}
                >
                  PROCESAR COMPRA
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}