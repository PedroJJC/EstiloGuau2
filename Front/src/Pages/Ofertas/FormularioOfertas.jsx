import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const FormularioOferta = () => {

  const [oferta, setOferta] = useState({
    oferta: '',
    descripcion: '',
    fechaRegistro: '',
    vigencia: '',
    status: 1
  });
 
  const [agregado, setAgregado] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convierte el valor a mayúsculas si el nombre del campo es 'descripcion'
    const newValue = name === 'descripcion' ? value.toUpperCase() : value;
  
    setOferta(prevState => ({
      ...prevState,
      [name]: name === 'status' ? (value === 'activo' ? 1 : 0) : newValue
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/ofertas-nuevo', oferta);
      if (response.status === 201) {
        setAgregado(true);
        setTimeout(() => {
          setAgregado(false);
          navigate('/ofertas');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al agregar la oferta:', error);
    }
  };
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    setOferta((prevUsuario) => ({
      ...prevUsuario,
      fechaRegistro: today
    }));
  }, []);


  return (
    <div className="pl-72 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
       <Navbar />
      <Sidebar/>
     
  
        <div className="carrito-container mx-4 my-8 flex-1 mt-10">
        <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Nuevo Oferta</h2>
          <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl pb-10">Por favor, ingrese los datos solicitados de la oferta, recuerde que todos lo campos son necesarios
            <span className="text-red-700 text-3xl">*</span></p>
          
          {agregado && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">¡Oferta agregada correctamente!</strong>
            </div>
          )}

<form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/2 px-3 mb-4">
      <label htmlFor="fechaRegistro" className="block text-gray-700 font-bold mb-2">
        Fecha de Registro
      </label>
      <input
        type="date"
        id="fechaRegistro"
        name="fechaRegistro"
        value={oferta.fechaRegistro}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        disabled
      />
    </div>

    <div className="w-full md:w-1/2 px-3 mb-4">
      <label htmlFor="oferta" className="block text-gray-700 font-bold mb-2">
        Valor de la Oferta
      </label>
      <input
        type="text"
        id="oferta"
        name="oferta"
        value={oferta.oferta}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese el descuento del cupón"
      />
    </div>
  </div>

  <div className="mb-4">
    <label htmlFor="descripcion" className="block text-gray-700 font-bold mb-2">
      Descripción
    </label>
    <textarea
      id="descripcion"
      name="descripcion"
      value={oferta.descripcion}
      onChange={handleChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline uppercase"
      placeholder="Ingrese el código del cupón"
    />
  </div>

  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/2 px-3 mb-4">
      <label htmlFor="vigencia" className="block text-gray-700 font-bold mb-2">
        Vigencia
      </label>
      <input
        type="date"
        id="vigencia"
        name="vigencia"
        value={oferta.vigencia}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>

    <div className="w-full md:w-1/2 px-3 mb-4">
      <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
        Estado
      </label>
      <select
        id="status"
        name="status"
        value={oferta.status === 1 ? 'activo' : 'inactivo'}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </div>
  </div>

  <div className="flex items-center justify-between">
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Agregar
    </button>
    <div className="text-right mb-4 ">
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
        <Footer />
      </div>
  );
};

export default FormularioOferta;
