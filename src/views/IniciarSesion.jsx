import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export default function IniciarSesion({ setUsuario }) {
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleIniciarSesion = async (e) => {
    e.preventDefault();

    // Mantener el admin hardcodeado (opcional) o moverlo a la base de datos
    if (credenciales.correo === 'admin@elbunker.cl' && credenciales.password === 'admin123') {
      const adminData = {
        nombre: 'Comandante Admin',
        correo: credenciales.correo,
        esAdmin: true
      };
      
      localStorage.setItem('usuario_activo', JSON.stringify(adminData));
      if (setUsuario) setUsuario(adminData);
      navigate('/admin');
      return;
    }

    try {
      // 1. Consultar a la nueva base de datos (GET)
      const response = await fetch('http://localhost:8080/api/usuario');
      const usuariosRegistrados = await response.json();
      
      // 2. Buscar si las credenciales coinciden
      const usuarioEncontrado = usuariosRegistrados.find(
        u => u.email === credenciales.correo && u.password === credenciales.password
      );

      if (usuarioEncontrado) {
        // Mantener 'usuario_activo' en localStorage para la sesión actual del navegador
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioEncontrado));
        if (setUsuario) setUsuario(usuarioEncontrado); 
        
        if (usuarioEncontrado.esAdmin) {
          navigate('/admin');
        } else {
          navigate('/categorias');
        }
      } else {
        setError('Correo o contraseña incorrectos, o usuario no registrado.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con la base de datos del Búnker.');
    }
  };

  const loginConGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const resGoogle = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await resGoogle.json();

        // 1. Verificar en la base de datos si el usuario de Google ya existe
        const resDb = await fetch('http://localhost:8080/api/usuario');
        const usuariosRegistrados = await resDb.json();
        let usuarioExistente = usuariosRegistrados.find(u => u.email === userInfo.email);

        // 2. Si no existe, lo guardamos en la base de datos (POST)
        if (!usuarioExistente) {
          const nuevoUsuario = {
            nombre: userInfo.name,
            email: userInfo.email,
            password: '', // Sin contraseña porque entra con Google
            esAdmin: false,
            avatar: userInfo.picture
          };

          const createRes = await fetch('http://localhost:8080/api/usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
          });
          
          usuarioExistente = await createRes.json();
        }

        // 3. Iniciar sesión en el frontend
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioExistente));
        if (setUsuario) setUsuario(usuarioExistente);

        navigate('/inicio'); 
      } catch (err) {
        console.error(err);
        setError('Error al iniciar sesión con Google o conectar con la base de datos.');
      }
    },
    onError: () => setError('Inicio de sesión con Google cancelado.'),
  });

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

      <div className="my-3 text-center">
        <span className="text-muted">o</span>
      </div>

      <button 
        type="button" 
        onClick={() => loginConGoogle()} 
        className="btn btn-outline-light w-100"
      >
        Continuar con Google
      </button>

        <div className="text-center mt-2">
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="text-info text-decoration-none fw-bold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </Container>
  );
}