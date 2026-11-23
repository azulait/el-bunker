import React, { useState, useEffect } from 'react';
import { ProductoCard } from '../components/ProductoCard';
import { Container, Row, Col, Nav } from 'react-bootstrap';

export function Categorias() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [listaProductos, setListaProductos] = useState([]);

  const categorias = ['Todas', 'Armas', 'Kits'];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/producto');
        const data = await response.json();
        setListaProductos(data);
      } catch (error) {
        console.error("Error obteniendo los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const productosFiltrados = categoriaActiva === 'Todas'
    ? listaProductos
    : listaProductos.filter(prod => prod.categoria === categoriaActiva);

  return (
    <Container className="mt-5 text-center">
      <h1 className="TituloBunker texto-rojo mb-4" style={{ fontSize: '4rem' }}>
        SUMINISTROS DEL BUNKER
      </h1>
      
      <p className="texto-blanco mb-5" style={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
        Selecciona una categoría para filtrar el equipamiento de supervivencia disponible.
      </p>

      <Nav 
        variant="pills" 
        activeKey={categoriaActiva} 
        onSelect={(selectedKey) => setCategoriaActiva(selectedKey)}
        className="justify-content-center mb-5 gap-3"
      >
        {categorias.map((cat) => (
          <Nav.Item key={cat}>
            <Nav.Link 
              eventKey={cat} 
              className={`btn-categoria ${categoriaActiva === cat ? 'active' : ''}`}
            >
              {cat === 'Armas' ? 'ARMAS Y DEFENSA' : cat === 'Kits' ? 'KITS' : 'TODAS'}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Row xs={1} md={2} lg={3} className="g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <Col key={prod.id}>
              <ProductoCard producto={prod} />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <h3 className="TituloZombie texto-amarillo" style={{ fontSize: '3rem' }}>
              NO HAY SUMINISTROS REGISTRADOS EN ESTA CATEGORÍA.
            </h3>
          </Col>
        )}
      </Row>
    </Container>
  );
}