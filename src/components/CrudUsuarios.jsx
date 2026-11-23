import React, { useState, useEffect } from 'react';
import { Table, Modal, Form } from 'react-bootstrap';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await fetch(`http://localhost:8080/api/usuario/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        const { id, ...usuarioSinId } = formData;
        await fetch('http://localhost:8080/api/usuario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuarioSinId)
        });
      }
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de expulsar a este sobreviviente del Búnker? Esta acción es irreversible.')) {
      try {
        await fetch(`http://localhost:8080/api/usuario/${id}`, {
          method: 'DELETE'
        });
        fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h4 className="texto-verde mb-3 mb-md-0" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>
          PERSONAL REGISTRADO
        </h4>
        <button onClick={handleShow} className="btn btn-estilos px-4 py-2">
          + NUEVO RECLUTA
        </button>
      </div>

      <div className="table-responsive mb-4">
        <Table variant="dark" borderless align="middle" className="m-0 text-white" style={{ fontFamily: 'sans-serif', backgroundColor: 'transparent' }}>
          <thead>
            {/* Cambiado text-secondary por text-white */}
            <tr className="border-bottom text-white" style={{ borderColor: '#444' }}>
              <th className="pb-3">Nombre</th>
              <th className="pb-3">Transmisión (Email)</th>
              <th className="pb-3">Rango</th>
              <th className="pb-3 text-end">Acciones Tácticas</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                {/* Cambiado text-muted por text-white */}
                <td colSpan="4" className="text-center text-white py-4">No hay sobrevivientes en los registros.</td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-bottom" style={{ borderColor: '#222' }}>
                  <td className="py-3 fw-bold text-white">{usuario.nombre.toUpperCase()}</td>
                  {/* Cambiado text-muted por text-white */}
                  <td className="py-3 text-white">{usuario.email}</td>
                  <td className="py-3">
                    {usuario.esAdmin ? (
                      <span className="badge border border-danger text-danger px-2 py-1 bg-transparent">
                        ADMINISTRADOR
                      </span>
                    ) : (
                      <span className="badge border border-secondary text-white px-2 py-1 bg-transparent">
                        SOBREVIVIENTE
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-end">
                    <button 
                      className="btn btn-outline-warning btn-sm me-2 fw-bold" 
                      onClick={() => handleEdit(usuario)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      MODIFICAR
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm fw-bold" 
                      onClick={() => handleDelete(usuario.id)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      EXPULSAR
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
        centered
      >
        <Form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif' }}>
          <Modal.Header className="border-bottom border-danger">
            <Modal.Title className="texto-rojo fw-bold" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2rem', letterSpacing: '1px' }}>
              {editMode ? 'MODIFICAR ARCHIVO' : 'REGISTRAR NUEVO RECLUTA'}
            </Modal.Title>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose} aria-label="Close"></button>
          </Modal.Header>
          
          <Modal.Body className="py-4">
            <Form.Group className="mb-4">
              <Form.Label className="texto-verde fw-bold">Nombre del Sobreviviente *</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                className="form-bg-bunker"
                placeholder="Ej: Rick Grimes"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="texto-verde fw-bold">Canal de Transmisión (Email) *</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="form-bg-bunker"
                placeholder="correo@bunker.cl"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="texto-verde fw-bold">Clave de Acceso *</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required={!editMode} 
                className="form-bg-bunker"
                placeholder={editMode ? "Dejar en blanco para mantener actual" : "Mínimo 6 caracteres"}
              />
            </Form.Group>

            <Form.Group className="mt-4 p-3 border border-danger rounded" style={{ backgroundColor: '#111' }}>
              <Form.Check 
                type="checkbox"
                id="esAdmin"
                name="esAdmin"
                checked={formData.esAdmin}
                onChange={handleChange}
                className="text-danger fw-bold"
                style={{ fontSize: '1rem' }}
                label="NIVEL DE AUTORIZACIÓN: ADMINISTRADOR (Acceso total al sistema)"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="border-top border-danger">
            <button type="button" className="btn btn-outline-secondary fw-bold" onClick={handleClose}>
              CANCELAR
            </button>
            <button type="submit" className="btn btn-estilos px-4">
              {editMode ? 'ACTUALIZAR DATOS' : 'CREAR ARCHIVO'}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}