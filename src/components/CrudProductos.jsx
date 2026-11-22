import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

export function CrudProductos() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    precio: '',
    categoria: '',
    imagen: '',
    descripcion: ''
  });

  // 1. Obtener datos desde la base de datos (GET)
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/producto');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setFormData({ id: '', nombre: '', precio: '', categoria: '', imagen: '', descripcion: '' });
  };
  
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Guardar (POST) o Actualizar (PUT) en la base de datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productoProcesado = { ...formData, precio: Number(formData.precio) };

    try {
      if (editMode) {
        // Actualizar existente
        await fetch(`http://localhost:8080/api/producto/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoProcesado)
        });
      } else {
        // Crear nuevo (SQL se encarga de asignar el ID)
        const { id, ...productoSinId } = productoProcesado;
        await fetch('http://localhost:8080/api/producto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoSinId)
        });
      }
      // Refrescar la tabla con los datos reales de la base de datos
      fetchProductos();
      handleClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  const handleEdit = (producto) => {
    setFormData(producto);
    setEditMode(true);
    setShowModal(true);
  };

  // 3. Eliminar de la base de datos (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este suministro del inventario?')) {
      try {
        await fetch(`http://localhost:8080/api/producto/${id}`, {
          method: 'DELETE'
        });
        // Refrescar la tabla
        fetchProductos();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="texto-amarillo mb-0">Gestión de Inventario</h4>
        <Button variant="danger" onClick={handleShow} className="fw-bold">
          + Nuevo Producto
        </Button>
      </div>

      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>
                <img src={producto.imagen} alt={producto.nombre} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} />
              </td>
              <td className="fw-bold">{producto.nombre}</td>
              <td>
                <span className={`badge ${producto.categoria === 'Armas' ? 'bg-danger' : 'bg-success'}`}>
                  {producto.categoria}
                </span>
              </td>
              <td className="texto-amarillo fw-bold">${producto.precio}</td>
              <td>{producto.descripcion.substring(0, 50)}...</td>
              <td>
                <Button variant="outline-info" size="sm" className="me-2 mb-1" onClick={() => handleEdit(producto)}>
                  Editar
                </Button>
                <Button variant="outline-danger" size="sm" className="mb-1" onClick={() => handleDelete(producto.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} data-bs-theme="dark" className="text-white" size="lg">
        <Modal.Header closeButton className="bg-dark border-secondary">
          <Modal.Title>{editMode ? 'Editar Producto' : 'Registrar Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="bg-dark">
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del suministro</Form.Label>
                  <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} required>
                    <option value="">Selecciona...</option>
                    <option value="Armas">Armas</option>
                    <option value="Kits">Kits</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Ruta de la Imagen</Form.Label>
                  <Form.Control type="text" name="imagen" placeholder="/img/arma.webp" value={formData.imagen} onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control type="number" name="precio" placeholder="Ej: 15000" value={formData.precio} onChange={handleChange} required />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Descripción del uso</Form.Label>
              <Form.Control as="textarea" rows={2} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
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