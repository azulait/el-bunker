import React, { useState } from 'react';
import { Container, Table, Form, Row, Col } from 'react-bootstrap';
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
      localStorage.removeItem('carrito_bunker'); 
      navigate('/pago-exito', { state: datosOrden });
    } else {
      navigate('/pago-error', { state: datosOrden });
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <div className="panel-bunker p-4 p-md-5">
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 border-bottom border-danger pb-3">
          <h2 className="TituloZombie texto-rojo mb-3 mb-md-0" style={{ fontSize: '3rem' }}>
            COORDENADAS DE ENTREGA
          </h2>
          <div className="modal-estilos p-2 px-4 text-center">
            <span className="texto-blanco fs-5" style={{ fontFamily: 'sans-serif' }}>TOTAL: </span>
            <span className="texto-verde fw-bold fs-4" style={{ fontFamily: 'sans-serif' }}>
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
        
        {esReintento && (
          <div className="alert bg-dark text-warning border-warning py-3 mb-4" role="alert" style={{ fontFamily: 'sans-serif' }}>
            ⚡ <strong>ALERTA DE TRANSMISIÓN:</strong> Conexión previa fallida. Intente retransmitir las coordenadas de pago.
          </div>
        )}

        <h4 className="texto-amarillo mb-3" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2rem', letterSpacing: '2px' }}>
          RESUMEN DE SUMINISTROS
        </h4>
        <div className="table-responsive mb-5">
          <Table borderless align="middle" className="texto-blanco" style={{ fontFamily: 'sans-serif' }}>
            <thead>
              <tr className="border-bottom text-secondary" style={{ borderColor: '#333' }}>
                <th>Img</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th className="text-center">Cant.</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id} className="border-bottom" style={{ borderColor: '#222' }}>
                  <td className="py-2">
                    <img src={item.imagen} alt={item.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#0d0d0d', borderRadius: '4px' }} />
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>{item.nombre.toUpperCase()}</td>
                  <td style={{ fontSize: '0.9rem' }}>${item.precio.toLocaleString()}</td>
                  <td className="text-center" style={{ fontSize: '0.9rem' }}>{item.cantidad}</td>
                  <td className="text-end fw-bold texto-rojo" style={{ fontSize: '0.9rem' }}>${(item.precio * item.cantidad).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif' }}>
          <h4 className="texto-verde mb-4" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2rem', letterSpacing: '2px' }}>
            1. IDENTIFICACIÓN DEL SUPERVIVIENTE
          </h4>
          <Row className="mb-5">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="texto-blanco form-label">Nombre *</Form.Label>
                <Form.Control type="text" name="nombre" required placeholder="Tu nombre" value={formData.nombre} onChange={handleChange} className="form-bg-bunker" />
                <Form.Control.Feedback type="invalid" className="text-danger">Requerido para identificación.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="texto-blanco form-label">Apellidos *</Form.Label>
                <Form.Control type="text" name="apellidos" required placeholder="Tus apellidos" value={formData.apellidos} onChange={handleChange} className="form-bg-bunker" />
                <Form.Control.Feedback type="invalid" className="text-danger">Requerido para identificación.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="texto-blanco form-label">Transmisión (Correo) *</Form.Label>
                <Form.Control type="email" name="correo" required placeholder="ejemplo@bunker.cl" value={formData.correo} onChange={handleChange} className="form-bg-bunker" />
                <Form.Control.Feedback type="invalid" className="text-danger">Ingresa una vía de contacto válida.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <h4 className="texto-verde mb-4" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2rem', letterSpacing: '2px' }}>
            2. UBICACIÓN DE ZONA SEGURA
          </h4>
          <Row className="mb-4">
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label className="texto-blanco form-label">Calle y Número *</Form.Label>
                <Form.Control type="text" name="calle" required placeholder="Dirección detallada" value={formData.calle} onChange={handleChange} className="form-bg-bunker" />
                <Form.Control.Feedback type="invalid" className="text-danger">Ingresa las coordenadas base.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="texto-blanco form-label">Bloque/Depto (Opcional)</Form.Label>
                <Form.Control type="text" name="depto" placeholder="Ej: 603" value={formData.depto} onChange={handleChange} className="form-bg-bunker" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="texto-blanco form-label">Región *</Form.Label>
                <Form.Select name="region" required value={formData.region} onChange={handleChange} className="form-bg-bunker">
                  <option value="Región Metropolitana de Santiago">RM - Zona Central</option>
                  <option value="Valparaíso">Valparaíso - Costa</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="texto-blanco form-label">Comuna/Sector *</Form.Label>
                <Form.Select name="comuna" required value={formData.comuna} onChange={handleChange} className="form-bg-bunker">
                  <option value="Cerrillos">Base Cerrillos</option>
                  <option value="Maipú">Base Maipú</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="texto-blanco form-label">Instrucciones tácticas de entrega (Opcional)</Form.Label>
                <Form.Control as="textarea" rows={3} name="indicaciones" placeholder="Ej: Dejar provisiones tras el muro norte..." value={formData.indicaciones} onChange={handleChange} className="form-bg-bunker" />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-5 pt-4 border-top border-danger">
            <button
              type="submit"
              className="btn btn-estilos p-3 px-5 fs-4"
              disabled={carrito.length === 0}
            >
              AUTORIZAR PAGO (${total.toLocaleString()})
            </button>
          </div>
        </Form>
      </div>
    </Container>
  );
}