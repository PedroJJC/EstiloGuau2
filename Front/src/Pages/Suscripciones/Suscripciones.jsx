import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../../Components/Navbar/Navbar";

const Suscripciones = () => {

  return (
    <div className="flex flex-col items-center py-20">
      <Navbar />
      {/* Título SUSCRIPCIONES con letra más gruesa */}
      <h1 className="text-6xl font-extrabold mb-20 mt-20 uppercase">SUSCRIPCIONES</h1>
      <div className="flex justify-center gap-16 mt-20">
        {planes.map((plan, index) => (
          <div
            key={index}
            className="bg-black text-white p-12 rounded-[33px] shadow-lg border-[16px] border-[#CCD5AE] max-w-lg"
            style={{ minWidth: '380px', minHeight: '500px', borderRadius: '45px' }}
          >
            {/* Título del plan (BASICO, PLUS, PREMIUM) */}
            <h2 className="text-5xl font-bold mb-6 text-left">{plan.titulo}</h2>
            
            {/* Beneficios del plan */}
            <ul className="mb-6 text-left text-2xl">
              {plan.beneficios.map((beneficio, i) => (
                <li key={i} className="mb-3">* {beneficio}</li>
              ))}
            </ul>
            
            {/* Precio */}
            <p className="text-3xl mb-8 text-left">Desde {plan.precio}</p>
            
            {/* Botón */}
            <button className="bg-[#FFFF00] text-black px-12 py-5 rounded-full text-2xl font-bold hover:bg-yellow-500 transition-colors">
              SUSCRIBIRSE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suscripciones;
