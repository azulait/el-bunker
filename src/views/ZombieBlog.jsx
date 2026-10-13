import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap'; // Importamos Row y Col
import { ZombiesBunker } from '../data/zombies';

export function ZombieBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Leemos del localStorage para que los cambios del Admin se vean aquí
  const guardados = JSON.parse(localStorage.getItem('zombies_bunker'));
  const zombiesActuales = guardados && guardados.length > 0 ? guardados : ZombiesBunker;

  // 2. Buscamos el zombie comparando los IDs como texto (más seguro)
  const zombie = zombiesActuales.find((z) => z.id.toString() === id.toString());

  if (!zombie) {
    return (
      <Container className="py-5 text-center">
        <h2 className="texto-rojo fuente-bunker TituloBunker">Expediente no encontrado</h2>
        <button className="btn-estilos mt-4 px-4 py-2" onClick={() => navigate('/zombies')}>
          Volver a la base
        </button>
      </Container>
    );
  }

  return (
    <Container className="py-5 texto-blanco">
      <button className="btn-estilos mb-4 px-4 py-2" onClick={() => navigate(-1)}>
        &larr; Volver a Archivos
      </button>

      <h1 className="TituloBunker texto-verde text-center mb-4 border-bottom border-danger pb-3">
        {zombie.nombre}
      </h1>

      {/* FILA DIVIDIDA: Imagen a la izquierda, Descripción a la derecha */}
      <Row className="mb-5 align-items-center">
        {/* Columna Izquierda (Imagen/Gif) */}
        <Col md={6} className="text-center text-md-end pe-md-4 mb-4 mb-md-0">
          <img 
            src={zombie.gif || zombie.imagen} 
            alt={`Animación de ${zombie.nombre}`} 
            className="img-fluid rounded img-estilos"
            style={{ maxHeight: '500px', width: '100%', maxWidth: '400px', objectFit: 'cover' }}
          />
        </Col>

        {/* Columna Derecha (Descripción) */}
        <Col md={6} className="text-center text-md-start ps-md-4">
          <h3 className="texto-rojo fuente-bunker mb-3">Descripción de la Amenaza:</h3>
          <p className="fs-4 text-light" style={{ lineHeight: '1.6' }}>
            {zombie.descripcion}
          </p>
          
          {/* Si quieres mostrar el texto del blog también, lo dejamos aquí abajo de la descripción */}
          {zombie.blog && (
            <p className="fs-5 text-secondary mt-3">
              <em>{zombie.blog}</em>
            </p>
          )}
        </Col>
      </Row>

      {/* RECUADRO INFERIOR: Consejo de Supervivencia */}
      <div className="modal-estilos p-4 p-md-5">
        <h3 className="texto-amarillo fuente-bunker border-bottom border-danger pb-2 mb-4">
          Consejo de Supervivencia:
        </h3>
        
        <p style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
          {zombie.consejo}
        </p>
      </div>
    </Container>
  );
}