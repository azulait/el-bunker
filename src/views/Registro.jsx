import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('info');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_bunker')) || [];
    
    // Validar si el correo ya existe
    const existe = usuariosRegistrados.find(u => u.correo === formData.correo);
    if (existe) {
      setTipoAlerta('danger');
      setMensaje('Este correo ya se encuentra registrado.');
      return;
    }

    usuariosRegistrados.push(formData);
    localStorage.setItem('usuarios_bunker', JSON.stringify(usuariosRegistrados));
    
    setTipoAlerta('success');
    setMensaje('¡Registro exitoso! Redirigiendo al inicio de sesión...');
    
    setTimeout(() => {
      navigate('/iniciar-sesion');
    }, 1500);
  };

  return (
    <Container className="my-5" style={{ maxWidth: '500px' }}>
      <Card className="shadow-lg p-4 bg-dark text-white border-secondary">
        <h2 className="mb-4 text-center">Crear Cuenta</h2>
        {mensaje && <Alert variant={tipoAlerta}>{mensaje}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingresa tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              name="apellidos"
              placeholder="Ingresa tus apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Ingresa una contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 fw-bold">
            Registrarse
          </Button>
        </Form>
      </Card>
    </Container>
  );
}