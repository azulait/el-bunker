import React, { useState, useEffect } from 'react';
import { Table, Modal, Form } from 'react-bootstrap';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productoProcesado = { ...formData, precio: Number(formData.precio) };

    try {
      if (editMode) {
        await fetch(`http://localhost:8080/api/producto/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoProcesado)
        });
      } else {
        const { id, ...productoSinId } = productoProcesado;
        await fetch('http://localhost:8080/api/producto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoSinId)
        });
      }
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este suministro del inventario? Esta acción es irreversible.')) {
      try {
        await fetch(`http://localhost:8080/api/producto/${id}`, {
          method: 'DELETE'
        });
        fetchProductos();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h4 className="texto-verde mb-3 mb-md-0" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>
          INVENTARIO DE SUMINISTROS
        </h4>
        <button onClick={handleShow} className="btn btn-estilos px-4 py-2">
          + NUEVO SUMINISTRO
        </button>
      </div>

      <div className="table-responsive mb-4">
        <Table variant="dark" borderless align="middle" className="m-0 text-white" style={{ fontFamily: 'sans-serif', backgroundColor: 'transparent' }}>
          <thead>
            {/* Cambiado text-secondary por text-white */}
            <tr className="border-bottom text-white" style={{ borderColor: '#444' }}>
              <th className="pb-3">Imagen</th>
              <th className="pb-3">Nombre</th>
              <th className="pb-3 text-center">Categoría</th>
              <th className="pb-3">Precio</th>
              <th className="pb-3">Descripción</th>
              <th className="pb-3 text-end">Acciones Tácticas</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                {/* Cambiado text-muted por text-white */}
                <td colSpan="6" className="text-center text-white py-4">No hay suministros registrados en el búnker.</td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.id} className="border-bottom" style={{ borderColor: '#222' }}>
                  <td className="py-2">
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre} 
                      style={{width: '50px', height: '50px', objectFit: 'contain', backgroundColor: '#0d0d0d', borderRadius: '4px'}} 
                    />
                  </td>
                  <td className="py-3 fw-bold text-white">{producto.nombre.toUpperCase()}</td>
                  <td className="py-3 text-center">
                    <span 
                      className={`badge border px-2 py-1 bg-transparent ${
                        producto.categoria === 'Armas' ? 'border-danger text-danger' : 'border-success text-success'
                      }`}
                    >
                      {producto.categoria.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 fw-bold texto-amarillo">\${producto.precio.toLocaleString()}</td>
                  {/* Cambiado text-muted por text-white */}
                  <td className="py-3 text-white" style={{ fontSize: '0.85rem' }}>
                    {producto.descripcion.length > 40 ? `${producto.descripcion.substring(0, 40)}...` : producto.descripcion}
                  </td>
                  <td className="py-3 text-end">
                    <button 
                      className="btn btn-outline-warning btn-sm me-2 fw-bold" 
                      onClick={() => handleEdit(producto)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      MODIFICAR
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm fw-bold" 
                      onClick={() => handleDelete(producto.id)}
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
              {editMode ? 'MODIFICAR SUMINISTRO' : 'REGISTRAR NUEVO SUMINISTRO'}
            </Modal.Title>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose} aria-label="Close"></button>
          </Modal.Header>
          
          <Modal.Body className="py-4">
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="texto-verde fw-bold">Nombre del Suministro *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    required 
                    className="form-bg-bunker"
                    placeholder="Ej: Bate con Púas"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="texto-verde fw-bold">Clasificación (Categoría) *</Form.Label>
                  <Form.Select 
                    name="categoria" 
                    value={formData.categoria} 
                    onChange={handleChange} 
                    required 
                    className="form-bg-bunker"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Armas">Armamento</option>
                    <option value="Kits">Kits de Supervivencia</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="texto-verde fw-bold">Ruta del Archivo Gráfico *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="imagen" 
                    placeholder="/img/arma.webp" 
                    value={formData.imagen} 
                    onChange={handleChange} 
                    required 
                    className="form-bg-bunker"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="texto-verde fw-bold">Valor de Intercambio (\$) *</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="precio" 
                    placeholder="Ej: 15000" 
                    value={formData.precio} 
                    onChange={handleChange} 
                    required 
                    className="form-bg-bunker"
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-2">
              <Form.Label className="texto-verde fw-bold">Descripción Táctica *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleChange} 
                required 
                className="form-bg-bunker"
                placeholder="Detalles sobre el uso y efectividad del suministro..."
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