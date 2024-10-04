import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const Suscripcion = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const { userData } = useContext(UserContext); // Obtener datos del usuario
  const idUsuario = userData.idUsuario; // Extraer el idUsuario

  useEffect(() => {
    obtenerSuscripciones();
  }, []);

  const obtenerSuscripciones = async () => {
    try {
      const response = await axios.get('http://localhost:3001/suscripciones');
      setSuscripciones(response.data);
    } catch (error) {
      console.error('Error al obtener las suscripciones:', error);
    }
  };

  const manejarSuscripcion = async (id_sub) => {
    try {
      const response = await axios.post('http://localhost:3001/comprar-suscripcion', {
        idUsuario, // Pasar el idUsuario al backend
        id_sub, // Pasar el id_sub correspondiente
      });
      console.log(response.data); // Manejar la respuesta del backend
    } catch (error) {
      console.error('Error al realizar la suscripción:', error);
    }
  };

  return (
    <div>
      <NavbarAdmin />
      <Sidebar />
      <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
        <div className="carrito-container mx-4 flex-1">
          <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Suscripciones Disponibles</h2>
          <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl">Resumen de todas las suscripciones</p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse border border-black">
              <thead className="bg-custom text-black text-medium">
                <tr>
                  <th className="py-3 px-4 text-center border border-white-900">Nombre</th>
                  <th className="py-3 px-4 text-center border border-white-900">Descripción</th>
                  <th className="py-3 px-4 text-center border border-white-900">Precio</th>
                  <th className="py-3 px-4 text-center border border-white-900">Suscribirse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {suscripciones.map(suscripcion => (
                  <tr key={suscripcion.id_sub}>
                    <td className="py-3 px-4 border border-gray-300">{suscripcion.nombre_sub}</td>
                    <td className="py-3 px-4 border border-gray-300">{suscripcion.descripcion_sub}</td>
                    <td className="py-3 px-4 border border-gray-300">${suscripcion.precio_sub}</td>
                    <td className="py-3 px-4 text-center border border-gray-300">
                      <button
                        className="bg-custom border hover:bg-second text-black font-medium py-2 px-4 rounded"
                        onClick={() => manejarSuscripcion(suscripcion.id_sub)} // Llamar a manejarSuscripcion con el id_sub correcto
                      >
                        Suscribirse
                      </button>
                    </td>
                  </tr>
                ))}
                {suscripciones.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 px-6 text-center text-gray-500 border-gray-300">
                      No hay suscripciones disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Suscripcion;
