import { Container, Card, Table, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

export function PagoExito() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const datosOrden = location.state || {
    nroOrden: '#20240705',
    cliente: { nombre: 'Cliente', apellidos: 'Búnker', correo: 'cliente@example.com' },
    direccion: { calle: 'Los Crisantemos, Edificio Norte', depto: 'Depto 603', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos', indicaciones: 'Entregar en conserjería' },
    carrito: [],
    total: 0
  };

  return (
    <Container className="my-4" style={{ maxWidth: '800px', fontFamily: 'sans-serif' }}>
      <Card className="panel-bunker shadow-lg p-4 border border-success">
        
        <div className="text-center mb-4 border-bottom border-success pb-4">
          <h2 className="texto-verde fw-bold" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2.5rem', letterSpacing: '1px' }}>
            ✓ TRANSMISIÓN EXITOSA
          </h2>
          <p className="text-light fs-5 mb-1">Los suministros han sido asegurados.</p>
          <p className="texto-amarillo fw-bold mb-0">Orden Nro: {datosOrden.nroOrden} | Código Táctico: ORDERZ1A5</p>
        </div>

        <h5 className="texto-verde fw-bold mb-3">Información del Sobreviviente</h5>
        <div className="p-3 rounded mb-4 text-white border border-secondary" style={{ backgroundColor: '#111' }}>
          <p className="mb-1"><strong>Nombre:</strong> {datosOrden.cliente.nombre} {datosOrden.cliente.apellidos}</p>
          <p className="mb-0"><strong>Frecuencia (Correo):</strong> {datosOrden.cliente.correo}</p>
        </div>

        <h5 className="texto-verde fw-bold mb-3">Coordenadas de Entrega</h5>
        <div className="p-3 rounded mb-4 text-white border border-secondary" style={{ backgroundColor: '#111' }}>
          <p className="mb-1"><strong>Sector:</strong> {datosOrden.direccion.calle} {datosOrden.direccion.depto && `(${datosOrden.direccion.depto})`}</p>
          <p className="mb-1"><strong>Zona:</strong> {datosOrden.direccion.comuna}, {datosOrden.direccion.region}</p>
          {datosOrden.direccion.indicaciones && (
            <p className="mb-0 text-warning"><strong>Instrucciones Tácticas:</strong> {datosOrden.direccion.indicaciones}</p>
          )}
        </div>

        <h5 className="texto-verde fw-bold mb-3">Detalle del Cargamento</h5>
        <div className="table-responsive mb-3">
          <Table variant="dark" borderless align="middle" className="m-0 text-white" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr className="border-bottom text-white" style={{ borderColor: '#444' }}>
                <th className="pb-3">Imagen</th>
                <th className="pb-3">Nombre</th>
                <th className="pb-3 text-center">Precio</th>
                <th className="pb-3 text-center">Cantidad</th>
                <th className="pb-3 text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {datosOrden.carrito.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-white py-4">No se registraron suministros.</td>
                </tr>
              ) : (
                datosOrden.carrito.map((item) => (
                  <tr key={item.id} className="border-bottom" style={{ borderColor: '#222' }}>
                    <td className="py-2">
                      <img src={item.imagen} alt={item.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#0d0d0d', borderRadius: '4px' }} />
                    </td>
                    <td className="py-3 fw-bold text-white">{item.nombre.toUpperCase()}</td>
                    <td className="py-3 text-center text-white">${item.precio.toLocaleString()}</td>
                    <td className="py-3 text-center fw-bold text-white">{item.cantidad}</td>
                    <td className="py-3 text-end fw-bold text-white">${(item.precio * item.cantidad).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-success">
          <Button className="btn btn-estilos fw-bold" onClick={() => navigate('/inicio')}>
            VOLVER AL REFUGIO
          </Button>
          <h4 className="fw-bold texto-verde mb-0">
            TOTAL TRANSFERIDO: ${datosOrden.total.toLocaleString()}
          </h4>
        </div>

      </Card>
    </Container>
  );
}