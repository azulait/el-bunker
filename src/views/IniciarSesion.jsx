import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

export default function IniciarSesion() {
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleIniciarSesion = (e) => {
    e.preventDefault();
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_bunker')) || [];
    
    const usuarioEncontrado = usuariosRegistrados.find(
      u => u.correo === credenciales.correo && u.password === credenciales.password
    );

    if (usuarioEncontrado) {
      localStorage.setItem('usuario_activo', JSON.stringify(usuarioEncontrado));
      navigate('/categorias');
    } else {
      setError('Correo o contraseña incorrectos, o usuario no registrado.');
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '400px' }}>
      <Card className="shadow-lg p-4 bg-dark text-white border-secondary">
        <h2 className="mb-4 text-center">Iniciar Sesión</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleIniciarSesion}>
          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              placeholder="Ingresa tu correo"
              value={credenciales.correo}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={credenciales.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 fw-bold mb-3">
            Ingresar
          </Button>
        </Form>

        <div className="text-center mt-2">
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            No tienes una cuenta?{' '}
            <Link to="/registro" className="text-info text-decoration-none fw-bold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </Container>
  );
}