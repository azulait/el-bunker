import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap'; 

export function ZombieBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para guardar el zombie encontrado y manejar el tiempo de carga
  const [zombie, setZombie] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchZombie = async () => {
      try {
        const respuesta = await fetch('http://localhost:8080/api/zombie');
        const datos = await respuesta.json();
        
        // Buscamos el zombie comparando los IDs
        const zombieEncontrado = datos.find((z) => z.id.toString() === id.toString());
        setZombie(zombieEncontrado);
      } catch (error) {
        console.error("Error obteniendo el expediente del zombie:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchZombie();
  }, [id]);

  // Pantalla de carga mientras espera la respuesta de la base de datos
  if (cargando) {
    return (
      <Container className="py-5 text-center texto-blanco">
        <h2 className="texto-verde fuente-bunker TituloBunker">Desencriptando expediente...</h2>
      </Container>
    );
  }

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