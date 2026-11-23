import React, { useState } from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export function Registro({ setUsuario }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', email: '', password: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('info');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resGet = await fetch('http://localhost:8080/api/usuario');
      const usuariosRegistrados = await resGet.json();
      const existe = usuariosRegistrados.find(u => u.email === formData.email);

      if (existe) {
        setTipoAlerta('danger');
        setMensaje('Este correo ya se encuentra registrado.');
        return;
      }

      const nuevoUsuario = { 
        nombre: `${formData.nombre} ${formData.apellidos}`.trim(),
        email: formData.email, password: formData.password, esAdmin: false 
      };

      const response = await fetch('http://localhost:8080/api/usuario', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoUsuario)
      });

      if (response.ok) {
        setTipoAlerta('success');
        setMensaje('¡Registro exitoso! Redirigiendo al inicio de sesión...');
        setTimeout(() => { navigate('/iniciar-sesion'); }, 1500);
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

  const registroConGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const resGoogle = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await resGoogle.json();

        const resDb = await fetch('http://localhost:8080/api/usuario');
        const usuariosGuardados = await resDb.json();
        let usuarioExistente = usuariosGuardados.find(u => u.email === userInfo.email);

        if (!usuarioExistente) {
          const nuevoUsuario = {
            nombre: `${userInfo.given_name || userInfo.name} ${userInfo.family_name || ''}`.trim(),
            email: userInfo.email, password: '', esAdmin: false, avatar: userInfo.picture
          };
          const createRes = await fetch('http://localhost:8080/api/usuario', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoUsuario)
          });
          usuarioExistente = await createRes.json();
        }

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
      <div className="panel-bunker p-5">
        <h2 className="mb-4 text-center TituloZombie texto-rojo" style={{ fontSize: '2.5rem' }}>
          CREAR CUENTA
        </h2>
        
        {mensaje && (
          <Alert 
            variant={tipoAlerta} 
            className={tipoAlerta === 'danger' ? 'bg-dark text-danger border-danger' : 'bg-dark text-success border-success'}
          >
            {mensaje}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="texto-blanco form-label">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingresa tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="form-bg-bunker"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="texto-blanco form-label">Apellidos</Form.Label>
            <Form.Control
              type="text"
              name="apellidos"
              placeholder="Ingresa tus apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              className="form-bg-bunker"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="texto-blanco form-label">Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="admin@elbunker.cl"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-bg-bunker"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="texto-blanco form-label">Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Ingresa una contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-bg-bunker"
            />
          </Form.Group>

          <button type="submit" className="btn btn-estilos w-100 p-2 mb-3 fs-5">
            REGISTRARSE
          </button>
        </Form>

        <div className="my-3 text-center">
          <span className="text-muted small">O REGÍSTRATE DIRECTAMENTE</span>
        </div>

        <button
          type="button"
          onClick={() => registroConGoogle()}
          className="btn btn-outline-secondary text-white w-100 p-2 d-flex align-items-center justify-content-center gap-2"
        >
          Registrarse con Google
        </button>
      </div>
    </Container>
  );
}