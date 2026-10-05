import Container from 'react-bootstrap/Container';

export function Home() { 
  return (
    <Container className="mt-5 text-center text-white fuente-bunker">
      <h1 className="display-3 mb-4 text-danger">Bienvenido a El Bunker</h1>
      
      <div className="bg-dark p-5 rounded border border-secondary shadow">
        <p className="fs-3 mb-4">
          El apocalipsis ya está aquí, pero en nuestro refugio estarás a salvo. 
        </p>
        <p className="fs-4">
          Somos el principal proveedor de supervivencia del yermo. Navega por nuestro menú 
          para equiparte con el mejor armamento, kits de primeros auxilios de grado militar 
          y raciones de comida para soportar el fin del mundo.
        </p>
        <p className="fs-4 mt-4 text-warning">
          Sobrevivir no es una opción, es una obligación. Equípate ahora.
        </p>
      </div>
    </Container>
  );
}