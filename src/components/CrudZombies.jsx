import React, { useState, useEffect } from 'react';
import { Table, Modal, Form } from 'react-bootstrap';

export function CrudZombies() {
  const [zombies, setZombies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    categoria: '',
    imagen: '',
    gif: '',
    descripcion: '',
    blog: '',
    consejo: ''
  });

  const fetchZombies = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/zombie');
      const data = await response.json();
      setZombies(data);
    } catch (error) {
      console.error("Error obteniendo zombies:", error);
    }
  };

  useEffect(() => {
    fetchZombies();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setFormData({ id: '', nombre: '', categoria: '', imagen: '', gif: '', descripcion: '', blog: '', consejo: '' });
  };
  
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await fetch(`http://localhost:8080/api/zombie/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        const { id, ...zombieSinId } = formData;
        await fetch('http://localhost:8080/api/zombie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(zombieSinId)
        });
      }
      fetchZombies();
      handleClose();
    } catch (error) {
      console.error("Error al guardar el zombie:", error);
    }
  };

  const handleEdit = (zombie) => {
    setFormData(zombie);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta amenaza de los archivos? La información se perderá permanentemente.')) {
      try {
        await fetch(`http://localhost:8080/api/zombie/${id}`, {
          method: 'DELETE'
        });
        fetchZombies();
      } catch (error) {
        console.error("Error al eliminar el zombie:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h4 className="texto-verde mb-3 mb-md-0" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>
          ARCHIVOS DE INFECTADOS
        </h4>
        <button onClick={handleShow} className="btn btn-estilos px-4 py-2">
          + REGISTRAR AMENAZA
        </button>
      </div>

      <div className="table-responsive mb-4">
        <Table variant="dark" borderless align="middle" className="m-0 text-white" style={{ fontFamily: 'sans-serif', backgroundColor: 'transparent' }}>
          <thead>
            {/* Cambiado text-secondary por text-white */}
            <tr className="border-bottom text-white" style={{ borderColor: '#444' }}>
              <th className="pb-3">Imagen</th>
              <th className="pb-3">Nombre</th>
              <th className="pb-3 text-center">Nivel de Peligro</th>
              <th className="pb-3">Descripción Breve</th>
              <th className="pb-3 text-end">Acciones Tácticas</th>
            </tr>
          </thead>
          <tbody>
            {zombies.length === 0 ? (
              <tr>
                {/* Cambiado text-muted por text-white */}
                <td colSpan="5" className="text-center text-white py-4">No hay amenazas registradas en la base de datos.</td>
              </tr>
            ) : (
              zombies.map((zombie) => (
                <tr key={zombie.id} className="border-bottom" style={{ borderColor: '#222' }}>
                  <td className="py-2">
                    <img 
                      src={zombie.imagen} 
                      alt={zombie.nombre} 
                      style={{width: '50px', height: '50px', objectFit: 'contain', backgroundColor: '#0d0d0d', borderRadius: '4px'}} 
                    />
                  </td>
                  <td className="py-3 fw-bold text-white">{zombie.nombre.toUpperCase()}</td>
                  <td className="py-3 text-center">
                    <span 
                      className={`badge border px-2 py-1 bg-transparent ${
                        zombie.categoria === 'Alto' ? 'border-danger text-danger' : 
                        zombie.categoria === 'Medio' ? 'border-warning text-warning' : 
                        'border-success text-success'
                      }`}
                    >
                      {zombie.categoria ? zombie.categoria.toUpperCase() : 'DESCONOCIDO'}
                    </span>
                  </td>
                  {/* Cambiado text-muted por text-white */}
                  <td className="py-3 text-white" style={{ fontSize: '0.85rem' }}>
                    {zombie.descripcion ? (zombie.descripcion.length > 40 ? `${zombie.descripcion.substring(0, 40)}...` : zombie.descripcion) : ''}
                  </td>
                  <td className="py-3 text-end">
                    <button 
                      className="btn btn-outline-warning btn-sm me-2 fw-bold" 
                      onClick={() => handleEdit(zombie)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      MODIFICAR
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm fw-bold" 
                      onClick={() => handleDelete(zombie.id)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      ELIMINAR
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Modal 
        show={showModal} 
        onHide={handleClose} 
        backdrop="static"
        contentClassName="panel-bunker p-2" 
        size="lg"
        centered
      >
        <Form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif' }}>
          <Modal.Header className="border-bottom border-danger">
            <Modal.Title className="texto-rojo fw-bold" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2rem', letterSpacing: '1px' }}>
              {editMode ? 'MODIFICAR ARCHIVO DE AMENAZA' : 'REGISTRAR NUEVA AMENAZA'}
            </Modal.Title>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose} aria-label="Close"></button>
          </Modal.Header>
          
          <Modal.Body className="py-4">
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="texto-verde fw-bold">Nombre del Infectado *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    required 
                    className="form-bg-bunker"
                    placeholder="Ej: Spitter"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="texto-verde fw-bold">Nivel de Peligro *</Form.Label>
                  <Form.Select 
                    name="categoria" 
                    value={formData.categoria} 
                    onChange={handleChange} 
                    required
                    className="form-bg-bunker"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="texto-verde fw-bold">Ruta Imagen Estática (.webp/.jpg) *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="imagen" 
                    placeholder="/img/zombie.webp" 
                    value={formData.imagen} 
                    onChange={handleChange} 
                    required 
                    className="form-bg-bunker"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="texto-verde fw-bold">Ruta Animación (GIF) (Opcional)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="gif" 
                    placeholder="/img/zombie.gif" 
                    value={formData.gif} 
                    onChange={handleChange} 
                    className="form-bg-bunker"
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="texto-verde fw-bold">Descripción Táctica *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleChange} 
                required 
                className="form-bg-bunker"
                placeholder="Detalla el comportamiento y habilidades del infectado..."
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="texto-verde fw-bold">Bitácora / Cita del Blog (Opcional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                name="blog" 
                value={formData.blog} 
                onChange={handleChange} 
                className="form-bg-bunker"
                placeholder="Ej: 'Ayer perdimos a tres hombres por el ácido...'"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="texto-verde fw-bold">Consejo de Supervivencia (Opcional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                name="consejo" 
                value={formData.consejo} 
                onChange={handleChange} 
                className="form-bg-bunker"
                placeholder="¿Cómo matar a esta variante?"
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer className="border-top border-danger">
            <button type="button" className="btn btn-outline-secondary fw-bold" onClick={handleClose}>
              CANCELAR
            </button>
            <button type="submit" className="btn btn-estilos px-4">
              {editMode ? 'ACTUALIZAR DATOS' : 'CREAR REGISTRO'}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}