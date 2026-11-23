import { Container, Card, Table, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

export function PagoError() {
  const location = useLocation();
  const navigate = useNavigate();

  const datosOrden = location.state || {
    nroOrden: '#20240705',
    cliente: { nombre: 'Cliente', apellidos: 'Búnker', correo: 'cliente@example.com' },
    direccion: { calle: 'Los Crisantemos', depto: 'Depto 603', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos', indicaciones: '' },
    carrito: [],
    total: 0,
    formData: {}
  };

  const handleVolverAIntentar = () => {
    navigate('/checkout', {
      state: {
        esReintento: true,
        formData: datosOrden.formData
      }
    });
  };

  return (
    <Container className="my-4" style={{ maxWidth: '800px', fontFamily: 'sans-serif' }}>
      <Card className="panel-bunker shadow-lg p-4 border border-danger">
        
        <div className="text-center mb-4 border-bottom border-danger pb-4">
          <h2 className="texto-rojo fw-bold" style={{ fontFamily: "'Shlop', cursive, sans-serif", fontSize: '2.5rem', letterSpacing: '1px' }}>
            ☒ TRANSMISIÓN FALLIDA
          </h2>
          <p className="text-light fs-5">No se pudo procesar la orden {datosOrden.nroOrden}</p>

          <Button 
            className="btn btn-outline-danger fw-bold my-2 px-4"
            size="lg"
            onClick={handleVolverAIntentar}
          >
            REINTENTAR OPERACIÓN
          </Button>
        </div>

        <h5 className="texto-verde fw-bold mb-3">Información del Sobreviviente</h5>
        <div className="p-3 rounded mb-4 text-white border border-secondary" style={{ backgroundColor: '#111' }}>
          <p className="mb-1"><strong>Nombre:</strong> {datosOrden.cliente.nombre} {datosOrden.cliente.apellidos}</p>
          <p className="mb-0"><strong>Frecuencia (Correo):</strong> {datosOrden.cliente.correo}</p>
        </div>

        <h5 className="texto-verde fw-bold mb-3">Coordenadas de Entrega</h5>
        <div className="p-3 rounded mb-4 text-white border border-secondary" style={{ backgroundColor: '#111' }}>
          <p className="mb-1"><strong>Sector:</strong> {datosOrden.direccion.calle} {datosOrden.direccion.depto && `(${datosOrden.direccion.depto})`}</p>
          <p className="mb-0"><strong>Zona:</strong> {datosOrden.direccion.comuna}, {datosOrden.direccion.region}</p>
        </div>

        <h5 className="texto-verde fw-bold mb-3">Suministros Solicitados</h5>
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
                  <td colSpan="5" className="text-center text-white py-4">No hay suministros en la orden.</td>
                </tr>
              ) : (
                datosOrden.carrito.map((item) => (
                  <tr key={item.id} className="border-bottom" style={{ borderColor: '#222' }}>
                    <td className="py-2">
                      <img src={item.imagen} alt={item.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#0d0d0d', borderRadius: '4px' }} />
                    </td>
                    <td className="py-3 fw-bold text-white">{item.nombre.toUpperCase()}</td>
                    <td className="py-3 text-center text-white">\${item.precio.toLocaleString()}</td>
                    <td className="py-3 text-center fw-bold text-white">{item.cantidad}</td>
                    <td className="py-3 text-end fw-bold text-white">\${(item.precio * item.cantidad).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-end align-items-center mt-3 pt-3 border-top border-danger">
          <h4 className="fw-bold texto-rojo mb-0">
            FONDOS PENDIENTES: \${datosOrden.total.toLocaleString()}
          </h4>
        </div>

      </Card>
    </Container>
  );
}