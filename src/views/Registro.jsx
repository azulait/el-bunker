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

const registroConGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();

        const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
        let usuarioExistente = usuariosGuardados.find(u => u.email === userInfo.email);

        if (!usuarioExistente) {
          usuarioExistente = {
            id: Date.now(),
            nombre: userInfo.given_name || userInfo.name,
            apellidos: userInfo.family_name || '',
            email: userInfo.email,
            rol: 'cliente',
            avatar: userInfo.picture
          };
          usuariosGuardados.push(usuarioExistente);
          localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));
        }

        localStorage.setItem('usuario_activo', JSON.stringify(usuarioExistente));
        if (setUsuario) setUsuario(usuarioExistente);
        navigate('/inicio');

      } catch (err) {
        console.error("Error al registrarse con Google:", err);
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