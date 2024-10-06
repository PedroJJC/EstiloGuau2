import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const Suscripcion = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const { userData } = useContext(UserContext);
  const idUsuario = userData.idUsuario;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerSuscripciones();
  }, []);

  const obtenerSuscripciones = async () => {
    try {
      const response = await axios.get('http://localhost:3001/suscripciones');
      setSuscripciones(response.data);
    } catch (error) {
      console.error('Error al obtener las suscripciones:', error);
      setError('No se pudieron cargar las suscripciones. Intenta más tarde.');
    }
  };

  const manejarSuscripcion = async (id_sub) => {
    try {
      const response = await axios.post('http://localhost:3001/comprar-suscripcion', {
        idUsuario,
        id_sub,
      });
      alert(`Te has suscrito a: ${response.data.nombre_sub}`);
    } catch (error) {
      console.error('Error al realizar la suscripción:', error);
      setError('Error al realizar la suscripción. Intenta nuevamente.');
    }
  };

  const openModal = (suscripcion) => {
    setSelectedSubscription(suscripcion);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSubscription(null);
  };

  const confirmSubscription = () => {
    if (selectedSubscription) {
      manejarSuscripcion(selectedSubscription.id_sub);
      closeModal();
    }
  };

  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
      <Navbar />
      <Sidebar />
      <h1 className="text-4xl font-extrabold mb-10 mt-10 uppercase">SUSCRIPCIONES DISPONIBLES</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex justify-center gap-8 mt-10 flex-wrap">
        {suscripciones.map(suscripcion => (
          <div
            key={suscripcion.id_sub}
            className="bg-black text-white p-8 rounded-[20px] shadow-lg border-[6px] border-[#CCD5AE] max-w-sm flex flex-col justify-between"
            style={{ width: '300px', height: '400px', overflow: 'hidden' }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 text-left">{suscripcion.nombre_sub}</h2>
              <p className="mb-4 text-left" style={{ maxHeight: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {suscripcion.descripcion_sub}
              </p>
              <p className="text-xl mb-6 text-left">Desde ${suscripcion.precio_sub}</p>
            </div>
            <button
              className="bg-[#FFFF00] text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-500 transition-colors"
              onClick={() => openModal(suscripcion)}
            >
              SUSCRIBIRSE
            </button>
          </div>
        ))}
        {suscripciones.length === 0 && (
          <div className="text-center text-gray-500">
            <h2 className="text-2xl">No hay suscripciones disponibles.</h2>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedSubscription && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-3xl font-bold mb-4">{selectedSubscription.nombre_sub}</h2>
            <p className="mb-4">{selectedSubscription.descripcion_sub}</p>
            <p className="text-xl mb-4">Precio: ${selectedSubscription.precio_sub}</p>
            <p className="mb-4">Duración: {selectedSubscription.duracion_sub} días</p>
            <p className="mb-4">Beneficios:</p>
            {selectedSubscription.beneficios && selectedSubscription.beneficios.length > 0 ? (
              <ul className="list-disc list-inside mb-4">
                {selectedSubscription.beneficios.map((beneficio, index) => (
                  <li key={index}>{beneficio}</li>
                ))}
              </ul>
            ) : (
              <p>No hay beneficios disponibles.</p>
            )}
            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={confirmSubscription}
              >
                Confirmar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Suscripcion;
