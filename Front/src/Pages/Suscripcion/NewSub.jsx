import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const FormularioSuscripcion = () => {
  const [suscripcion, setSuscripcion] = useState({
    nombre_sub: '',
    descripcion_sub: '',
    duracion_sub: '',
    precio_sub: '',
    beneficios: ''
  });

  const [agregado, setAgregado] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuscripcion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Resetear error

    // Validaciones
    if (suscripcion.precio_sub <= 0) {
      setError('El precio debe ser un número positivo.');
      return;
    }

    // Convertir beneficios a formato JSON (array de strings)
    const beneficiosArray = suscripcion.beneficios
      .split('\n') // Dividir por saltos de línea
      .map(beneficio => beneficio.trim()) // Eliminar espacios en blanco
      .filter(beneficio => beneficio !== ''); // Eliminar entradas vacías

    const nuevaSuscripcion = {
      ...suscripcion,
      beneficios: JSON.stringify(beneficiosArray) // Convertir a JSON
    };

    try {
      const response = await axios.post('http://localhost:3001/suscripcion', nuevaSuscripcion);
      if (response.status === 201) {
        setAgregado(true);
        setTimeout(() => {
          setAgregado(false);
          navigate('/suscripcion');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al agregar la suscripción:', error);
      setError('Error al agregar la suscripción. Intente nuevamente.');
    }
  };

  return (
    <div className="pl-72 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
      <Navbar />
      <Sidebar />

      <div className="carrito-container mx-4 my-8 flex-1 mt-10">
        <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Nueva Suscripción</h2>
        <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl pb-10">
          Por favor, ingrese los datos solicitados de la suscripción, recuerde que todos los campos son necesarios
          <span className="text-red-700 text-3xl">*</span>
        </p>

        {agregado && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">¡Suscripción agregada correctamente!</strong>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
          <div className="mb-4">
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
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="descripcion_sub" className="block text-gray-700 font-bold mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion_sub"
              name="descripcion_sub"
              value={suscripcion.descripcion_sub}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese una descripción de la suscripción"
              required
            />
          </div>

          <div className="mb-4">
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
              required
            />
          </div>

          <div className="mb-4">
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
              placeholder="Ingrese el precio de la suscripción"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="beneficios" className="block text-gray-700 font-bold mb-2">
              Beneficios (ingresa uno por línea)
            </label>
            <textarea
              id="beneficios"
              name="beneficios"
              value={suscripcion.beneficios}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese los beneficios de la suscripción, uno por línea"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FormularioSuscripcion;
