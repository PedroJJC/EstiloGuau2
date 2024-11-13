import { Carousel } from "flowbite-react";
import PerritoVerde from "../../img/PerritoVerde.jpeg";
import PerritoLentes from "../../img/PerritoLentes.jpeg";
import PerritoAguacate2 from "../../img/PerritoAguacate2.jpg";

export function Carrusel() {
  return (
    <div className="h-80 lg:h-custom-2xl"> {/* Ajusta este valor según sea necesario */}
      <Carousel leftControl={<span className="hidden">.</span>} 
                rightControl={<span className="hidden">.</span>}>
        <img className="w-full h-auto object-cover" src={PerritoVerde} alt="Perrito Verde" />
        <img className="w-full h-auto object-cover" src={PerritoLentes} alt="Perrito Lentes" />
        <img className="w-full h-auto object-cover" src={PerritoAguacate2} alt="Perrito Aguacate" />
      </Carousel>
    </div>
  );
}
