import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../components/ProductoCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export function Kits() {
  const [productos, setProductos] = useState([]);

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

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-5">Bienvenido al Refugio</h1>

      <Row xs={1} md={2} lg={3} className="g-4">
        {productos
          .filter((prod) => prod.categoria === 'Kits')
          .map((prod) => (
            <Col key={prod.id}>
              <ProductoCard producto={prod} />
            </Col>
          ))}
      </Row>
    </Container>
  );
}