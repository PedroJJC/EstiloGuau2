import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import FooterAdmin from "../../Components/Footer/FooterAdmin";
import Sidebar from '../../Components/Sidebar/Sidebar';

const EditarSub = () => {
  const [suscripcion, setSuscripcion] = useState({
    nombre_sub: '',
    descripcion_sub: '',
    duracion_sub: '',
    precio_sub: '',
    beneficios: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const obtenerSuscripcion = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/suscripcion/${id}`);
        setSuscripcion({
          ...response.data,
          beneficios: Array.isArray(response.data.beneficios) ? response.data.beneficios.join(', ') : ''
        });
      } catch (error) {
        console.error(`Error al obtener la suscripción con ID ${id}:`, error.response ? error.response.data : error);
        setMessage(`Error al obtener la suscripción: ${error.response ? error.response.data.message : error.message}`);
      }
    };

    obtenerSuscripcion();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuscripcion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convierte beneficios de texto a un array
      const beneficiosArray = suscripcion.beneficios.split(',').map(beneficio => beneficio.trim()).filter(beneficio => beneficio);
      const suscripcionActualizada = {
        ...suscripcion,
        beneficios: beneficiosArray // Asegúrate de enviar un array
      };

      console.log('Datos a enviar:', suscripcionActualizada); // Para depuración

      const response = await axios.put(`http://localhost:3001/api/suscripcion/${id}`, suscripcionActualizada);
      if (response.status === 200) {
        setMessage('Suscripción actualizada exitosamente.');
        setTimeout(() => navigate('/suscripciones'), 2000);
      }
    } catch (error) {
      console.error(`Error al actualizar la suscripción con ID ${id}:`, error.response ? error.response.data : error);
      setMessage('Error al actualizar la suscripción: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="pl-72 pr-24 pt-20 carrito-page flex flex-col min-h-screen shadow-lg">
      <Navbar />
      <Sidebar />
      <div className="carrito-container mx-4 flex-1">
        <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Editar Suscripción</h2>
        <p className="pl-10 font-light ml-4 text-center text-1xl pb-10">Por favor, ingrese los datos que desea modificar.</p>

        {message && (
          <div className={`py-5 px-6 mb-4 rounded relative ${message.includes('exitosamente') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
            <strong className="font-bold">{message.includes('exitosamente') ? '¡Éxito! ' : 'Error!'}</strong>
            <p className="block sm:inline">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
          <div className="flex flex-wrap mb-6">
            <div className="w-full mb-4 pr-2">
              <label htmlFor="nombre_sub" className="block text-gray-700 font-bold mb-2">
                Nombre de la Suscripción
              </label>
              <input
                type="text"
                id="nombre_sub"
                name="nombre_sub"
                value={suscripcion.nombre_sub}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ingrese el nombre de la suscripción"
              />
            </div>

            <div className="w-full mb-4 pr-2">
              <label htmlFor="precio_sub" className="block text-gray-700 font-bold mb-2">
                Precio
              </label>
              <input
                type="number"
                id="precio_sub"
                name="precio_sub"
                value={suscripcion.precio_sub}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ingrese el precio"
                min="0"
              />
            </div>

            <div className="w-full mb-4 pr-2">
              <label htmlFor="duracion_sub" className="block text-gray-700 font-bold mb-2">
                Duración (días)
              </label>
              <input
                type="number"
                id="duracion_sub"
                name="duracion_sub"
                value={suscripcion.duracion_sub}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ingrese la duración en días"
                min="1"
              />
            </div>

            <div className="w-full pr-2">
              <label htmlFor="descripcion_sub" className="block text-gray-700 font-bold mb-2">
                Descripción y/o Beneficios
              </label>
              <textarea
                id="descripcion_sub"
                name="descripcion_sub"
                value={suscripcion.descripcion_sub}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ingrese la descripción"
              />
            </div>

            <div className="w-full pr-2">
              <label htmlFor="beneficios" className="block text-gray-700 font-bold mb-2">
                Beneficios (separados por comas)
              </label>
              <textarea
                id="beneficios"
                name="beneficios"
                value={suscripcion.beneficios}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ingrese los beneficios, separados por comas"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-custom hover:second text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar
            </button>
            <div className="text-right">
              <button
                onClick={() => navigate(-1)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Volver
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="m-10">
        <FooterAdmin />
      </div>
    </div>
  );
};

export default EditarSub;
