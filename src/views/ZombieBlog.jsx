import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap'; 

export function ZombieBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [zombie, setZombie] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchZombie = async () => {
      try {
        const respuesta = await fetch('http://localhost:8080/api/zombie');
        const datos = await respuesta.json();
        
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

  if (cargando) {
    return (
      <Container className="py-5 text-center d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <h2 className="texto-verde mb-0" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '4rem', letterSpacing: '3px' }}>
          DESENCRIPTANDO EXPEDIENTE...
        </h2>
      </Container>
    );
  }

  if (!zombie) {
    return (
      <Container className="py-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <h2 className="texto-rojo mb-4" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '4rem', letterSpacing: '3px' }}>
          EXPEDIENTE NO ENCONTRADO
        </h2>
        <button className="btn btn-estilos px-4 py-2 fs-5" onClick={() => navigate('/zombies')}>
          VOLVER A LA BASE
        </button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <button className="btn btn-estilos mb-4 px-4 py-2" onClick={() => navigate(-1)}>
        &larr; VOLVER A ARCHIVOS
      </button>

      <h1 
        className="texto-verde text-center mb-5 border-bottom border-danger pb-3"
        style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '5rem', letterSpacing: '4px' }}
      >
        {zombie.nombre.toUpperCase()}
      </h1>

      <Row className="mb-5 align-items-center">
        <Col md={6} className="text-center text-md-end pe-md-4 mb-4 mb-md-0 d-flex justify-content-md-end justify-content-center">
          <div className="img-estilos p-3" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#0d0d0d', borderRadius: '8px' }}>
            <img 
              src={zombie.gif || zombie.imagen} 
              alt={`Archivos de ${zombie.nombre}`} 
              className="img-fluid"
              style={{ 
                height: '400px', 
                width: '100%', 
                objectFit: 'contain', 
                objectPosition: 'center' 
              }}
            />
          </div>
        </Col>

        <Col md={6} className="text-center text-md-start ps-md-4">
          <h3 
            className="texto-rojo mb-3"
            style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '3rem', letterSpacing: '2px' }}
          >
            DESCRIPCIÓN DE LA AMENAZA:
          </h3>
          
          <p className="texto-blanco" style={{ fontFamily: 'sans-serif', fontSize: '1.2rem', lineHeight: '1.6' }}>
            {zombie.descripcion}
          </p>
          
          {zombie.blog && (
            <p className="texto-amarillo mt-4" style={{ fontFamily: 'sans-serif', fontSize: '1.1rem', fontStyle: 'italic', borderLeft: '3px solid #ffc107', paddingLeft: '15px' }}>
              "{zombie.blog}"
            </p>
          )}
        </Col>
      </Row>

      <div className="modal-estilos p-4 p-md-5 mt-5">
        <h3 
          className="texto-amarillo border-bottom border-danger pb-3 mb-4 text-center text-md-start"
          style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '3rem', letterSpacing: '2px' }}
        >
          CONSEJO DE SUPERVIVENCIA:
        </h3>
        
        <p className="texto-blanco mb-0" style={{ fontFamily: 'sans-serif', fontSize: '1.2rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
          {zombie.consejo}
        </p>
      </div>
    </Container>
  );
}