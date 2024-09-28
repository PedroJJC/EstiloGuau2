import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { Carrusel } from "../../Components/Carrusel/Carrusel";
import Perritos from "../../img/Perritos.jpeg";
import PerritoCapucha from "../../img/PerritoCapucha.jpg";
import FooterLanding from '../../Components/Footer/FooterLanding';

function Landing() {
  return (
    <div className="landing-page">
      {/* Navbar Fijo */}
      <Navbar />

      {/* Contenedor Principal con Padding Superior Responsivo */}
      <main className="pt-20 md:pt-28">
        {/* Sección de Imagen Principal */}
        <div className="main-image-section bg-black">
          <div className="main-image flex justify-center">
            <div className="bg-black w-full">
              <img
                className="object-cover w-full h-64 sm:h-64 md:h-80 lg:h-[700px] pt-10"
                src={Perritos}
                alt="Perritos"
              />
            </div>
          </div>
        </div>

        <div className="bg-black py-4 md:py-8 "> {/* Ajusta el padding según sea necesario */}
          <div className="max-w-full overflow-hidden"> {/* Esto asegura que el contenido no se desborde */}
            <Carrusel />
          </div>
        </div>

        <h2 className="text-4xl sm:text-sm md:text-7xl lg:9xl font-bold bg-black text-white text-center" 
        style={{ letterSpacing: 'sm:0.6rem md:0.8rem ' }}>
       C O L E C C I O N &nbsp; V E R A N O 
        </h2>

        {/* Sección "CAMINANDO CON ESTILO" */}
        <div className="flex flex-col md:flex-row items-center bg-black justify-between px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-white text-center md:text-left mx-auto max-w-screen-xl">
            <h2 className="text-4xl sm:text-6xl md:text-8xl mb-4 font-bold text-center">&nbsp;CAMINANDO</h2>
            <h2 className="text-4xl sm:text-8xl md:text-7xl mb-4 font-thin text-center">CON</h2>
            <h2 className="text-4xl sm:text-6xl md:text-8xl mb-4 font-bold text-center">ESTILO</h2>
          </div>
          <div className="image-section bg-black bg-opacity-100 mt-8 md:mt-0">
            <div className="image-content flex items-center justify-center">
              <img
                className="w-48 sm:w-28 md:w-auto lg:w-auto h-auto"
                src={PerritoCapucha}
                alt="Perrito con Capucha"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterLanding />
    </div>
  );
}

export default Landing;
