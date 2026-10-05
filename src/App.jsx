import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavbarBunker } from './components/NavBarBunker';
import { Home } from './views/Inicio';
import { Armas } from './views/Armas';

function App() {
  return (
    <BrowserRouter>
      <NavbarBunker />

      <Routes>
        <Route path="/inicio" element={<Home />} />
        <Route path="/armas" element={<Armas />} />
        <Route path="*" element={<h2 className="text-center mt-5 text-danger">Página no encontrada</h2>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App;