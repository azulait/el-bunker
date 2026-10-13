import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavbarBunker } from './components/NavBarBunker';
import { Home } from './views/Inicio';
import { Zombies } from './views/Zombies';
import { Categorias } from './views/Categorias';
import { ZombieBlog } from './views/ZombieBlog';
import  Carrito from './views/Carrito';
import Checkout from './views/Checkout';
import { PagoExito } from './views/PagoExito';
import { PagoError } from './views/PagoError';
import { Registro } from './views/Registro';
import IniciarSesion from './views/IniciarSesion';
import { Admin } from './views/Admin';


 function App() {
  const [usuario, setUsuario] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuario_activo');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  const cerrarSesion = () => {
    localStorage.removeItem('usuario_activo');
    setUsuario(null);
  };

  return (
    <BrowserRouter>
      <NavbarBunker usuario={usuario} cerrarSesion={cerrarSesion}/>

      <Routes>
        <Route path="/inicio" element={<Home />} />
        <Route path="/zombies" element={<Zombies />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/zombie/:id" element={<ZombieBlog />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago-exito" element={<PagoExito />} />
        <Route path="/pago-error" element={<PagoError />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion setUsuario={setUsuario} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<h2 className="text-center mt-5 text-danger">Página no encontrada</h2>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App;