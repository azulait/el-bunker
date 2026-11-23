import React, { useState } from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
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

    if (credenciales.correo === 'admin@elbunker.cl' && credenciales.password === 'admin123') {
      const adminData = { nombre: 'Comandante Admin', correo: credenciales.correo, esAdmin: true };
      localStorage.setItem('usuario_activo', JSON.stringify(adminData));
      if (setUsuario) setUsuario(adminData);
      navigate('/admin');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/usuario');
      const usuariosRegistrados = await response.json();
      const usuarioEncontrado = usuariosRegistrados.find(
        u => u.email === credenciales.correo && u.password === credenciales.password
      );

      if (usuarioEncontrado) {
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioEncontrado));
        if (setUsuario) setUsuario(usuarioEncontrado); 
        if (usuarioEncontrado.esAdmin) { navigate('/admin'); } else { navigate('/categorias'); }
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

        const resDb = await fetch('http://localhost:8080/api/usuario');
        const usuariosRegistrados = await resDb.json();
        let usuarioExistente = usuariosRegistrados.find(u => u.email === userInfo.email);

        if (!usuarioExistente) {
          const nuevoUsuario = {
            nombre: userInfo.name, email: userInfo.email, password: '', esAdmin: false, avatar: userInfo.picture
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
        console.error(err);
        setError('Error al iniciar sesión con Google o conectar con la base de datos.');
      }
    },
    onError: () => setError('Inicio de sesión con Google cancelado.'),
  });

  return (
    <Container className="my-5" style={{ maxWidth: '450px' }}>
      <div className="panel-bunker p-5">
        <h2 className="mb-4 text-center TituloZombie texto-rojo" style={{ fontSize: '3.5rem' }}>
          INICIAR SESIÓN
        </h2>
        
        {error && <Alert variant="danger" className="bg-dark text-danger border-danger">{error}</Alert>}

        <Form onSubmit={handleIniciarSesion}>
          <Form.Group className="mb-3">
            <Form.Label className="texto-blanco form-label">Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              placeholder="Ingresa tu correo"
              value={credenciales.correo}
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
              placeholder="Ingresa tu contraseña"
              value={credenciales.password}
              onChange={handleChange}
              required
              className="form-bg-bunker"
            />
          </Form.Group>

          <button type="submit" className="btn btn-estilos w-100 p-2 mb-3 fs-5">
            INGRESAR
          </button>
        </Form>

        <div className="my-3 text-center">
          <span className="text-muted">o</span>
        </div>

        <button 
          type="button" 
          onClick={() => loginConGoogle()} 
          className="btn btn-outline-secondary text-white w-100 p-2"
        >
          Continuar con Google
        </button>

        <div className="text-center mt-4">
  <p className="texto-blanco mb-0" style={{ fontSize: '1rem' }}>
    ¿No tienes una cuenta?{' '}
    <Link to="/registro" className="texto-amarillo text-decoration-none fw-bold ms-1">
      Regístrate aquí
    </Link>
  </p>
</div>
      </div>
    </Container>
  );
}