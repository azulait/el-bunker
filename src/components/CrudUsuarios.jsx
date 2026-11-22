import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

export function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    email: '',
    password: '',
    esAdmin: false
  });

  // 1. Obtener usuarios desde la base de datos (GET)
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuario');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setFormData({ id: '', nombre: '', email: '', password: '', esAdmin: false });
  };
  
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // 2. Guardar (POST) o Actualizar (PUT) en la base de datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Actualizar existente
        await fetch(`http://localhost:8080/api/usuario/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Crear nuevo (SQL le asignará el ID automáticamente)
        const { id, ...usuarioSinId } = formData;
        await fetch('http://localhost:8080/api/usuario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuarioSinId)
        });
      }
      // Refrescar la tabla consultando de nuevo a la BD
      fetchUsuarios();
      handleClose();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setEditMode(true);
    setShowModal(true);
  };

  // 3. Eliminar de la base de datos (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de expulsar a este sobreviviente del Búnker?')) {
      try {
        await fetch(`http://localhost:8080/api/usuario/${id}`, {
          method: 'DELETE'
        });
        // Refrescar la tabla
        fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="texto-amarillo mb-0">Gestión de Sobrevivientes</h4>
        <Button variant="danger" onClick={handleShow} className="fw-bold">
          + Nuevo Usuario
        </Button>
      </div>

      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No hay usuarios registrados.</td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="fw-bold">{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`badge ${usuario.esAdmin ? 'bg-danger' : 'bg-secondary'}`}>
                    {usuario.esAdmin ? 'Administrador' : 'Sobreviviente'}
                  </span>
                </td>
                <td>
                  <Button variant="outline-info" size="sm" className="me-2 mb-1" onClick={() => handleEdit(usuario)}>
                    Editar
                  </Button>
                  <Button variant="outline-danger" size="sm" className="mb-1" onClick={() => handleDelete(usuario.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} data-bs-theme="dark" className="text-white">
        <Modal.Header closeButton className="bg-dark border-secondary">
          <Modal.Title>{editMode ? 'Editar Sobreviviente' : 'Registrar Nuevo Sobreviviente'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="bg-dark">
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico (Email)</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control 
                type="text" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required={!editMode} 
                placeholder={editMode ? "Deja en blanco para no cambiar" : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                id="esAdmin"
                name="esAdmin"
                label="Otorgar permisos de Administrador"
                checked={formData.esAdmin}
                onChange={handleChange}
                className="texto-amarillo"
              />
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