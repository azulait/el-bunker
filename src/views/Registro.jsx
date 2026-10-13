import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '', 
    password: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('info');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    const existe = usuariosRegistrados.find(u => u.email === formData.email);
    if (existe) {
      setTipoAlerta('danger');
      setMensaje('Este correo ya se encuentra registrado.');
      return;
    }

    const nuevoUsuario = { 
      ...formData, 
      id: Date.now().toString(), 
      esAdmin: false 
    };

    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
    
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
            {/* Cambiado el name a 'email' */}
            <Form.Control
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
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