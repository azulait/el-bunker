import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export function Registro({ setUsuario }) {
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

  // 1. Registro manual conectado a Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Verificamos si el correo ya existe en la Base de Datos
      const resGet = await fetch('http://localhost:8080/api/usuario');
      const usuariosRegistrados = await resGet.json();
      const existe = usuariosRegistrados.find(u => u.email === formData.email);

      if (existe) {
        setTipoAlerta('danger');
        setMensaje('Este correo ya se encuentra registrado.');
        return;
      }

      // Preparamos el usuario uniendo nombre y apellido para el backend
      const nuevoUsuario = { 
        nombre: `${formData.nombre} ${formData.apellidos}`.trim(),
        email: formData.email,
        password: formData.password,
        esAdmin: false 
      };

      // Guardamos en la base de datos (POST)
      const response = await fetch('http://localhost:8080/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      if (response.ok) {
        setTipoAlerta('success');
        setMensaje('¡Registro exitoso! Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          navigate('/iniciar-sesion');
        }, 1500);
      } else {
        setTipoAlerta('danger');
        setMensaje('Error al registrar el usuario en el servidor.');
      }
    } catch (error) {
      console.error(error);
      setTipoAlerta('danger');
      setMensaje('Error de conexión con la base de datos del Búnker.');
    }
  };

  // 2. Registro con Google conectado a Spring Boot
  const registroConGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const resGoogle = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await resGoogle.json();

        // Consultamos la BD
        const resDb = await fetch('http://localhost:8080/api/usuario');
        const usuariosGuardados = await resDb.json();
        let usuarioExistente = usuariosGuardados.find(u => u.email === userInfo.email);

        // Si no existe, lo creamos en la BD
        if (!usuarioExistente) {
          const nuevoUsuario = {
            nombre: `${userInfo.given_name || userInfo.name} ${userInfo.family_name || ''}`.trim(),
            email: userInfo.email,
            password: '',
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

        // Activamos la sesión en el frontend
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioExistente));
        if (setUsuario) setUsuario(usuarioExistente);
        navigate('/inicio');

      } catch (err) {
        console.error("Error al registrarse con Google:", err);
        setTipoAlerta('danger');
        setMensaje('Error al conectar con la base de datos.');
      }
    },
    onError: () => console.log('Registro con Google cancelado'),
  });

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
        <div className="my-3 text-center">
        <span className="text-secondary small">O REGÍSTRATE DIRECTAMENTE</span>
      </div>

      <button
        type="button"
        onClick={() => registroConGoogle()}
        className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
      >
        Registrarse con Google
      </button>
      </Card>
    </Container>
  );
}