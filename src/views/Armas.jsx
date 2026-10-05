import { productosBunker } from '../data/productos';
import { ProductoCard } from '../components/ProductoCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export function Armas() {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-5">Bienvenido al Refugio</h1>
      
    <Row xs={1} md={2} lg={3} className="g-4">
        {productosBunker
            .filter((prod) => prod.categoria === 'Armas') 
            .map((prod) => (                              
            <Col key={prod.id}>
                <ProductoCard producto={prod} />
            </Col>
        ))}
    </Row>  
    </Container>
  );
}