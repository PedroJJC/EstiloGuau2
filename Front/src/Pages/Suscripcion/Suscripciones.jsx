import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const Suscripcion = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const { userData } = useContext(UserContext);
  const idUsuario = userData.idUsuario;
  const navigate = useNavigate();
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

  const manejarSuscripcion = async (suscripcion) => {
    if (!idUsuario) {
      alert('Debes estar logueado para suscribirte.');
      return;
    }
    
    // Verificar si ya tiene una empresa asociada
    try {
      const response = await axios.get(`http://localhost:3001/empresa/verificar/${idUsuario}`);
      if (response.data.existe) {
        alert(`Ya tienes una empresa asociada: ${response.data.vendedor.nom_empresa}`);
        navigate('/perfil-vendedor'); // Redirigir al perfil
        return;
      }
    } catch (error) {
      console.error('Error al verificar la empresa:', error);
      setError('Error al verificar la empresa.');
      return; // No continuar si hay un error
    }

    // Aquí rediriges al formulario de registro con el ID de la suscripción
    navigate(`/registro-vendedor?subscriptionId=${suscripcion.id_sub}`);
  };

  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
      <Navbar />
      <Sidebar />
      <h1 className="text-4xl text-center font-extrabold mb-10 mt-10 uppercase">SUSCRIPCIONES DISPONIBLES</h1>
  
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
              onClick={() => manejarSuscripcion(suscripcion)}
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

      <Footer />
    </div>
  );
};

export default Suscripcion;
