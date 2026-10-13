import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
// 1. Importamos tus datos estáticos de productos
import { productosBunker } from '../data/productos';

export function CrudProductos() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // 2. Adaptamos el estado a tu estructura de datos de productos
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    precio: '',
    categoria: '',
    imagen: '',
    descripcion: ''
  });

  // 3. Cargar datos iniciales (De LocalStorage o de tu archivo JS)
  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos_bunker'));
    
    if (productosGuardados && productosGuardados.length > 0) {
      setProductos(productosGuardados);
    } else {
      // Si no hay datos en localStorage, carga los de productos.js por defecto
      setProductos(productosBunker);
      localStorage.setItem('productos_bunker', JSON.stringify(productosBunker));
    }
  }, []);

  const guardarDatos = (nuevosProductos) => {
    localStorage.setItem('productos_bunker', JSON.stringify(nuevosProductos));
    setProductos(nuevosProductos);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setFormData({ id: '', nombre: '', precio: '', categoria: '', imagen: '', descripcion: '' });
  };
  
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Asegurarnos de que el precio se guarde como número
    const productoProcesado = { ...formData, precio: Number(formData.precio) };

    if (editMode) {
      const productosActualizados = productos.map(p => p.id === formData.id ? productoProcesado : p);
      guardarDatos(productosActualizados);
    } else {
      // Crear nuevo asignando un ID numérico basado en la hora
      const nuevoProducto = { ...productoProcesado, id: Date.now() };
      guardarDatos([...productos, nuevoProducto]);
    }
    handleClose();
  };

  const handleEdit = (producto) => {
    setFormData(producto);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este suministro del inventario?')) {
      const productosFiltrados = productos.filter(p => p.id !== id);
      guardarDatos(productosFiltrados);
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
              <td className="texto-amarillo fw-bold">\${producto.precio}</td>
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
                    <option value="Kits Médicos">Kits Médicos</option>
                    <option value="Otros">Otros</option>
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
                  <Form.Label>Precio (\$)</Form.Label>
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