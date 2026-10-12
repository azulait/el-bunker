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
    <Container className="my-4" style={{ maxWidth: '800px' }}>
      <Card className="shadow-lg p-4 bg-dark text-white border-danger border-2">
        
        <div className="text-center mb-4">
          <h2 className="text-danger fw-bold">
            ☒ No se pudo realizar el pago. nro {datosOrden.nroOrden}
          </h2>
          <p className="text-muted">Detalle de la compra</p>

          <Button 
            variant="success" 
            size="lg" 
            className="fw-bold my-3 px-4"
            onClick={handleVolverAIntentar}
          >
            VOLVER A REALIZAR EL PAGO
          </Button>
        </div>

        <h5 className="border-bottom border-secondary pb-2 mb-3">Información del cliente</h5>
        <div className="bg-secondary p-3 rounded mb-4 text-white">
          <p className="mb-1"><strong>Nombre:</strong> {datosOrden.cliente.nombre} {datosOrden.cliente.apellidos}</p>
          <p className="mb-0"><strong>Correo:</strong> {datosOrden.cliente.correo}</p>
        </div>

        <h5 className="border-bottom border-secondary pb-2 mb-3">Dirección de entrega de los productos</h5>
        <div className="bg-secondary p-3 rounded mb-4 text-white">
          <p className="mb-1"><strong>Calle:</strong> {datosOrden.direccion.calle} {datosOrden.direccion.depto && `(${datosOrden.direccion.depto})`}</p>
          <p className="mb-0"><strong>Comuna / Región:</strong> {datosOrden.direccion.comuna}, {datosOrden.direccion.region}</p>
        </div>

        <h5 className="border-bottom border-secondary pb-2 mb-3">Detalle de productos intentados</h5>
        <Table responsive borderless align="middle" variant="dark" className="mb-3">
          <thead>
            <tr className="border-bottom border-secondary text-muted">
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {datosOrden.carrito.map((item) => (
              <tr key={item.id} className="border-bottom border-secondary">
                <td>
                  <img src={item.imagen} alt={item.nombre} style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
                </td>
                <td>{item.nombre}</td>
                <td>${item.precio.toLocaleString()}</td>
                <td>{item.cantidad}</td>
                <td>${(item.precio * item.cantidad).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-end align-items-center mt-3 pt-3 border-top border-secondary">
          <h4 className="fw-bold text-danger mb-0">
            Total pendiente: ${datosOrden.total.toLocaleString()}
          </h4>
        </div>

      </Card>
    </Container>
  );
}