import { describe, it, expect} from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Home } from '../views/Inicio';
import IniciarSesion from '../views/IniciarSesion';
import { Registro } from '../views/Registro';
import { Categorias } from '../views/Categorias';
import { Zombies } from '../views/Zombies';
import Carrito from '../views/Carrito';
import { Admin } from '../views/Admin';

const renderConContexto = (componente) => {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <MemoryRouter>
        {componente}
      </MemoryRouter>
    </GoogleOAuthProvider>
  );
};

describe('Pruebas de Test por cada Vista', () => {
  it('Test de Vista Inicio', () => {
    renderConContexto(<Home />);
    expect(document.body).toBeTruthy();
  });

  it('Test de Vista Iniciar Sesión', () => {
    renderConContexto(<IniciarSesion setUsuario={() => {}} />);
    expect(screen.getByText(/Iniciar Sesión/i)).toBeTruthy();
  });

  it('Test de Vista Registro', () => {
    renderConContexto(<Registro setUsuario={() => {}} />);
    expect(screen.getByText(/Crear Cuenta/i)).toBeTruthy();
  });

  it('Test de Vista Categorías', () => {
    renderConContexto(<Categorias />);
    expect(document.body).toBeTruthy();
  });

  it('Test de Vista Guía de Zombies', () => {
    renderConContexto(<Zombies />);
    expect(document.body).toBeTruthy();
  });

  it('Test de Vista Carrito', () => {
    renderConContexto(<Carrito />);
    expect(document.body).toBeTruthy();
  });

  it('Test de Vista Admin', () => {
    renderConContexto(<Admin />);
    expect(document.body).toBeTruthy();
  });
});