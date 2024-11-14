import Navbar from '../../Components/Navbar/Navbar';
import { Carrusel } from "../../Components/Carrusel/Carrusel";
import Perritos from "../../img/Perritos.png";
import PerritoCapucha from "../../img/PerritoCapucha.jpg";
import Footer from '../../Components/Footer/Footer';
import { useEffect, useState, useContext } from 'react';
import './Landing.css';
import { HiArrowCircleDown,  HiArrowCircleUp } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { LocationContext  } from '../../Context/LocationContext';


function Landing() {
  const { location, city, country } = useContext(LocationContext);
  const [translateY, setTranslateY] = useState(0);
  const [maxTranslateY, setMaxTranslateY] = useState(0);

  // Definir el número de secciones
  const numberOfSections = 3;

  useEffect(() => {
    // Añadir la clase para deshabilitar el scroll
    document.body.classList.add('no-scroll');
    
    // Calcular el límite inferior de desplazamiento
    const calculateMaxTranslateY = () => {
      setMaxTranslateY(-(numberOfSections - 1) * window.innerHeight);
    };

    // Calcular al montar el componente
    calculateMaxTranslateY();

    // Actualizar al cambiar el tamaño de la ventana
    window.addEventListener('resize', calculateMaxTranslateY);

    // Limpiar el efecto al desmontar el componente
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('resize', calculateMaxTranslateY);
    };
  }, [numberOfSections]);

  // Función para desplazar hacia abajo
  const scrollDown = () => {
    setTranslateY((prevY) => {
      const newY = prevY - window.innerHeight;
      return newY < maxTranslateY ? maxTranslateY : newY;
    });
  };

  // Función para desplazar hacia arriba
  const scrollUp = () => {
    setTranslateY((prevY) => {
      const newY = prevY + window.innerHeight;
      return newY > 0 ? 0 : newY;
    });
  };


    // Determinar si se puede desplazar
    const canScrollDown = translateY > maxTranslateY;
    const canScrollUp = translateY < 0;


  return (
    <div className="landing-page bg-white">
      {/* Navbar Fijo */}
      <Navbar />

      {/* Contenedor Principal con Padding Superior Responsivo */}
      <main className=" mt-10     transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(${translateY}px)` }}>
        {/* Sección de Imagen Principal */}
        <div className="main-image-section bg-white ">
          <div className="main-image flex justify-center">
          <div className="relative w-full">
          <div className="relative w-full">
            <Link to="/tienda">
            <button className="absolute bottom-72 left-1/2 transform -translate-x-1/2 z-10 button-landing">
    <span className="button_top">Explorar productos</span>
  </button>
            </Link>
 

  <div className="bg-white w-full">
    <img
      className="w-full h-80 sm:h-64 md:h-96 lg:h-[800px] pt-10"
      src={Perritos}
      alt="Perritos"
    />
  </div>
</div>
</div>
          </div>
        </div>

        <div className="bg-white md:py-10">
          <div className="max-w-full overflow-hidden">
            <Carrusel />
          </div>
        </div>

        <h2 className="pt-10 text-4xl sm:text-sm md:text-7xl lg:text-8xl font-bold bg-white text-black text-center"
  style={{ letterSpacing: '0.5rem' }}>
  COLECCIÓN &nbsp; INVIERNO 
</h2>

       
        <div className="flex flex-col md:flex-row items-center bg-white justify-between px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-black text-center md:text-left mx-auto max-w-screen-xl">
            <h2 className="text-4xl sm:text-6xl md:text-8xl mb-4 font-bold text-center">&nbsp;CAMINANDO</h2>
            <h2 className="text-4xl sm:text-6xl md:text-8xl mb-4 font-bold text-center">CON</h2>
            <h2 className="text-4xl sm:text-6xl md:text-8xl mb-4 font-bold text-center">ESTILO</h2>
          </div>
          <div className="image-section bg-white bg-opacity-100 mt-8 md:mt-0">
            <div className="image-content flex items-center justify-center">
              <img
                className="w-48 sm:w-28 md:w-auto lg:w-auto h-auto"
                src={PerritoCapucha}
                alt="Perrito con Capucha"
              />
            </div>
          </div>
        </div>*/
      </main>

{/* Botones de desplazamiento */}
<div className="flex flex-col items-end fixed bottom-10 right-10 space-y-4">
  <HiArrowCircleUp
    onClick={scrollUp}
    className={`text-black w-20 h-auto rounded ${!canScrollUp ? 'opacity-50 cursor-not-allowed' : ''}`}
    hidden={!canScrollUp} // Esconde el botón si no se puede hacer scroll up
  >
    Arriba
  </HiArrowCircleUp>
  
  <HiArrowCircleDown
    onClick={scrollDown}
    className={`text-black w-20 h-auto rounded ${!canScrollDown ? 'opacity-50 cursor-not-allowed' : ''}`}
    hidden={!canScrollDown} // Esconde el botón si no se puede hacer scroll down
  >
    Abajo
  </HiArrowCircleDown>
</div>


      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Landing;
