import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

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

  // 1. Obtener datos desde la base de datos (GET)
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

  // 2. Guardar (POST) o Actualizar (PUT) en la base de datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Actualizar existente
        await fetch(`http://localhost:8080/api/zombie/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Crear nuevo (desestructuramos para quitar el 'id' vacío y que SQL lo asigne)
        const { id, ...zombieSinId } = formData;
        await fetch('http://localhost:8080/api/zombie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(zombieSinId)
        });
      }
      // Refrescar la tabla consultando de nuevo a la base de datos
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

  // 3. Eliminar de la base de datos (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro del Búnker?')) {
      try {
        await fetch(`http://localhost:8080/api/zombie/${id}`, {
          method: 'DELETE'
        });
        // Refrescar la tabla
        fetchZombies();
      } catch (error) {
        console.error("Error al eliminar el zombie:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="texto-amarillo mb-0">Registro de Amenazas</h4>
        <Button variant="danger" onClick={handleShow} className="fw-bold">
          + Nuevo Zombie
        </Button>
      </div>

      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {zombies.map((zombie) => (
            <tr key={zombie.id}>
              <td>
                <img src={zombie.imagen} alt={zombie.nombre} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} />
              </td>
              <td className="fw-bold">{zombie.nombre}</td>
              <td>
                <span className={`badge ${zombie.categoria === 'Alto' ? 'bg-danger' : zombie.categoria === 'Medio' ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {zombie.categoria}
                </span>
              </td>
              <td>{zombie.descripcion.substring(0, 50)}...</td>
              <td>
                <Button variant="outline-info" size="sm" className="me-2 mb-1" onClick={() => handleEdit(zombie)}>
                  Editar
                </Button>
                <Button variant="outline-danger" size="sm" className="mb-1" onClick={() => handleDelete(zombie.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} data-bs-theme="dark" className="text-white" size="lg">
        <Modal.Header closeButton className="bg-dark border-secondary">
          <Modal.Title>{editMode ? 'Editar Zombie' : 'Registrar Nuevo Zombie'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="bg-dark">
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} required>
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
                <Form.Group className="mb-3">
                  <Form.Label>Ruta Imagen (.webp/.jpg)</Form.Label>
                  <Form.Control type="text" name="imagen" placeholder="/img/zombie.webp" value={formData.imagen} onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Ruta GIF</Form.Label>
                  <Form.Control type="text" name="gif" placeholder="/img/zombie.gif" value={formData.gif} onChange={handleChange} />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={2} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Texto del Blog</Form.Label>
              <Form.Control as="textarea" rows={2} name="blog" value={formData.blog} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Consejo de Supervivencia</Form.Label>
              <Form.Control type="text" name="consejo" value={formData.consejo} onChange={handleChange} />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="danger" type="submit">
              {editMode ? 'Guardar Cambios' : 'Registrar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}