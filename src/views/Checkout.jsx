import React, { useState } from 'react';
import { Container, Card, Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const esReintento = location.state?.esReintento || false;

  const [carrito] = useState(() => {
    const guardado = localStorage.getItem('carrito_bunker');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState(
    location.state?.formData || {
      nombre: '',
      apellidos: '',
      correo: '',
      calle: '',
      depto: '',
      region: 'Región Metropolitana de Santiago',
      comuna: 'Cerrillos',
      indicaciones: ''
    }
  );

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const datosOrden = {
      nroOrden: `#2024${Math.floor(1000 + Math.random() * 9000)}`,
      cliente: { nombre: formData.nombre, apellidos: formData.apellidos, correo: formData.correo },
      direccion: { calle: formData.calle, depto: formData.depto, region: formData.region, comuna: formData.comuna, indicaciones: formData.indicaciones },
      carrito: carrito,
      total: total,
      formData: formData
    };

    const esExitoso = esReintento ? true : Math.random() > 0.5;

    if (esExitoso) {
      localStorage.removeItem('carrito_bunker'); // Se vacía el carrito
      navigate('/pago-exito', { state: datosOrden });
    } else {
      navigate('/pago-error', { state: datosOrden });
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: '800px' }}>
      <Card className="shadow-lg p-4 bg-dark text-white border-secondary">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Carrito de compra</h2>
          <Button variant="primary" className="fw-bold fs-5 px-3" disabled>
            Total a pagar: ${total.toLocaleString()}
          </Button>
        </div>
        
        {esReintento && (
          <div className="alert alert-warning py-2 mb-3" role="alert">
            ⚡ <strong>Error en el pago:</strong> Intente otra vez completar la compra
          </div>
        )}

        <p className="text-muted">Completa la siguiente información</p>

        <Table responsive borderless align="middle" variant="dark" className="mb-4 border-bottom border-secondary">
          <thead>
            <tr className="border-bottom border-secondary text-muted">
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.imagen} alt={item.nombre} style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
                </td>
                <td>{item.nombre}</td>
                <td>${item.precio.toLocaleString()}</td>
                <td>{item.cantidad}</td>
                <td>${(item.precio * item.cantidad).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <h4 className="mt-4 mb-3">Información del cliente</h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control type="text" name="nombre" required placeholder="Tu nombre" value={formData.nombre} onChange={handleChange} className="bg-secondary text-white border-0" />
                <Form.Control.Feedback type="invalid">Por favor ingresa tu nombre.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Apellidos *</Form.Label>
                <Form.Control type="text" name="apellidos" required placeholder="Tus apellidos" value={formData.apellidos} onChange={handleChange} className="bg-secondary text-white border-0" />
                <Form.Control.Feedback type="invalid">Por favor ingresa tus apellidos.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>Correo electrónico *</Form.Label>
                <Form.Control type="email" name="correo" required placeholder="ejemplo@correo.com" value={formData.correo} onChange={handleChange} className="bg-secondary text-white border-0" />
                <Form.Control.Feedback type="invalid">Ingresa un correo válido con @.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mt-4 mb-3">Dirección de entrega de los productos</h4>
          <Row className="mb-3">
            <Col md={8}>
              <Form.Group className="mb-2">
                <Form.Label>Calle y Número *</Form.Label>
                <Form.Control type="text" name="calle" required placeholder="Dirección detallada" value={formData.calle} onChange={handleChange} className="bg-secondary text-white border-0" />
                <Form.Control.Feedback type="invalid">Ingresa la dirección.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>Departamento (opcional)</Form.Label>
                <Form.Control type="text" name="depto" placeholder="Ej: 603" value={formData.depto} onChange={handleChange} className="bg-secondary text-white border-0" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Región *</Form.Label>
                <Form.Select name="region" required value={formData.region} onChange={handleChange} className="bg-secondary text-white border-0">
                  <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
                  <option value="Valparaíso">Valparaíso</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Comuna *</Form.Label>
                <Form.Select name="comuna" required value={formData.comuna} onChange={handleChange} className="bg-secondary text-white border-0">
                  <option value="Cerrillos">Cerrillos</option>
                  <option value="Maipú">Maipú</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Indicaciones opcionales</Form.Label>
                <Form.Control as="textarea" rows={2} name="indicaciones" placeholder="Indicaciones para la entrega..." value={formData.indicaciones} onChange={handleChange} className="bg-secondary text-white border-0" />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button
              type="submit"
              variant="success"
              size="lg"
              className="fw-bold px-4"
              disabled={carrito.length === 0}
            >
              Pagar ahora ${total.toLocaleString()}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}