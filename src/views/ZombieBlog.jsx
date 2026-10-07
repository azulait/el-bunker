import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { ZombiesBunker } from '../data/zombies'; // Asegúrate de que la ruta sea correcta

export function ZombieBlog() {
  const { id } = useParams(); // Obtiene el número de ID de la URL
  const navigate = useNavigate();

  // Busca el zombie en el arreglo donde el id coincida (lo convertimos a número por si acaso)
  const zombie = ZombiesBunker.find((z) => z.id === parseInt(id));

  // Si alguien escribe un ID que no existe en la URL, mostramos esto:
  if (!zombie) {
    return (
      <Container className="py-5 text-center">
        <h2 className="texto-rojo fuente-bunker TituloBunker">Expediente no encontrado</h2>
        <button className="btn-estilos mt-4 px-4 py-2" onClick={() => navigate('/')}>
          Volver a la base
        </button>
      </Container>
    );
  }

  // Si encuentra el zombie, renderiza la página del blog:
  return (
    <Container className="py-5 texto-blanco">
      {/* Botón para regresar */}
      <button className="btn-estilos mb-4 px-4 py-2" onClick={() => navigate(-1)}>
        &larr; Volver a Archivos
      </button>

      {/* Título Principal */}
      <h1 className="TituloBunker texto-rojo text-center mb-4 border-bottom border-danger pb-3">
        {zombie.nombre}
      </h1>

      {/* Imagen / GIF grande y centrada */}
      <div className="text-center mb-5">
        <img 
          src={zombie.gif || zombie.imagen} 
          alt={`Animación de ${zombie.nombre}`} 
          className="img-fluid rounded img-estilos"
          style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Contenedor del texto (Aprovechamos tus estilos del modal para hacer un recuadro genial) */}
      <div className="modal-estilos p-4 p-md-5">
        <h3 className="texto-amarillo fuente-bunker border-bottom border-danger pb-2 mb-4">
          Bitácora del Sobreviviente:
        </h3>
        
        {/* Usamos etiqueta <p> que ya estilizaste con font-size: 3rem en tu CSS */}
        <p style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
          {zombie.blog}
        </p>
      </div>
    </Container>
  );
}