import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const FormularioSub = () => {

  const [cupon, setCupon] = useState({
    cupon: '',
    descripcion: '',
    fechaRegistro: '',
    vigencia: '',
    status: 1  // Inicializar con un valor predeterminado (activo)
  });
 
  const [agregado, setAgregado] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convierte el valor a mayúsculas si el nombre del campo es 'descripcion'
    const newValue = name === 'descripcion' ? value.toUpperCase() : value;
  
    setCupon(prevState => ({
      ...prevState,
      [name]: name === 'status' ? (value === 'activo' ? 1 : 0) : newValue
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/cupones-nuevo', cupon);
      if (response.status === 201) {
        setAgregado(true);
        setTimeout(() => {
          setAgregado(false);
          navigate('/cupones');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al agregar el cupón:', error);
    }
  };
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    setCupon((prevUsuario) => ({
      ...prevUsuario,
      fechaRegistro: today
    }));
  }, []);


  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
       <Navbar />
      <Sidebar/>
     
  
        <div className="carrito-container mx-4 my-8 flex-1 mt-10">
        <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Nueva suscripción</h2>
          <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl pb-10">Por favor, ingrese los datos solicitados de la oferta, recuerde que todos lo campos son necesarios
            <span className="text-red-700 text-3xl">*</span></p>
          
          {agregado && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Suscripción agregada correctamente!</strong>
            </div>
          )}

<form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
  <div className="flex flex-wrap mb-6">
    <div className="w-full  mb-4 pr-2">
      <label htmlFor="cupon" className="block text-gray-700 font-bold mb-2">
        Nombre de la suscripción
      </label>
      <input
        type="text"
        id="cupon"
        name="cupon"
        value={cupon.cupon}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese el nombre de la suscripción"
      />
    </div>

    <div className="w-full md:w-1/2 mb-4 px-2">
      <label htmlFor="precio" className="block text-gray-700 font-bold mb-2">
        Precio
      </label>
      <input
        type="number"
        id="precio"
        name="precio"
        value={cupon.precio}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese el precio"
        min="0"
      />
    </div>

    <div className="w-full md:w-1/2 mb-4 pl-2">
      <label htmlFor="vigencia" className="block text-gray-700 font-bold mb-2">
        Vigenciaxd
      </label>
      <input
        type="date"
        id="vigencia"
        name="vigencia"
        value={cupon.vigencia}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  </div>

  <div className="flex flex-wrap mb-4">
    <div className="w-full  pr-2">
      <label htmlFor="descripcion" className="block text-gray-700 font-bold mb-2">
        Descripción y/o beneficios
      </label>
      <textarea
        id="descripcion"
        name="descripcion"
        value={cupon.descripcion}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese la descripción"
      />
    </div>

    {/* Puedes añadir más campos aquí si es necesario */}
  </div>

  <div className="flex items-center justify-between mb-4">
    <button
      type="submit"
      className="bg-custom hover:second text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Agregar
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
       <Footer />
       </div>
      </div>
  );
};

export default FormularioSub;
