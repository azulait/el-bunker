import { useState } from 'react';
import { productosBunker } from '../data/productos';
import { ProductoCard } from '../components/ProductoCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

export function Categorias() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  // Categorías disponibles
  const categorias = ['Todas', 'Armas', 'Kits'];

  // Filtrar productos según la categoría seleccionada
  const productosFiltrados = categoriaActiva === 'Todas'
    ? productosBunker
    : productosBunker.filter(prod => prod.categoria === categoriaActiva);

  return (
    <Container className="mt-5 text-white fuente-bunker">
      <h1 className="text-center mb-4 text-danger display-4">Suministros del Bunker</h1>
      <p className="text-center mb-4 fs-5 text-light">
        Selecciona una categoría para filtrar el equipamiento de supervivencia disponible.
      </p>

      {/* Selector de Categorías (Nav Pills) */}
      <Nav 
        variant="pills" 
        activeKey={categoriaActiva} 
        onSelect={(selectedKey) => setCategoriaActiva(selectedKey)}
        className="justify-content-center mb-5 gap-2"
      >
        {categorias.map((cat) => (
          <Nav.Item key={cat}>
            <Nav.Link 
              eventKey={cat} 
              className={`fw-bold px-4 py-2 border border-danger ${
                categoriaActiva === cat ? 'bg-danger text-white' : 'bg-dark text-danger'
              }`}
            >
              {cat === 'Armas' ? 'Armas y Defensa' : cat === 'Kits' ? 'Kits Médicos' : 'Todas'}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Grilla de Productos Filtrados */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <Col key={prod.id}>
              <ProductoCard producto={prod} />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <h3 className="text-warning">No hay suministros registrados en esta categoría.</h3>
          </Col>
        )}
      </Row>
    </Container>
  );
}