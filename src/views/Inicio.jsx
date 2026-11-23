import Container from 'react-bootstrap/Container';

export function Home() { 
  return (
    <Container className="mt-5 text-center">
      <h1 className="TituloBunker texto-rojo mb-4">BIENVENIDO A EL BUNKER</h1>
      
      <div className="panel-bunker p-5 mt-5">
        <p className="texto-blanco mb-4">
          El apocalipsis ya está aquí, pero en nuestro refugio estarás a salvo. 
        </p>
        <p className="texto-blanco mb-4">
          Somos el principal proveedor de supervivencia del yermo. Navega por nuestro menú 
          para equiparte con el mejor armamento, kits de primeros auxilios de grado militar 
          y raciones de comida para soportar el fin del mundo.
        </p>
        <p className="texto-amarillo mt-4 font-weight-bold">
          Sobrevivir no es una opción, es una obligación. Equípate ahora.
        </p>
      </div>
    </Container>
  );
}