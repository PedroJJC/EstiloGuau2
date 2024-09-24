import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';
import FooterAdmin from "../../Components/Footer/FooterAdmin";
import Sidebar from '../../Components/Sidebar/Sidebar';

const EditarSub = () => {
    const [cupon, setCupon] = useState({
      cupon: '',
      descripcion: '',
      fechaRegistro: '',
      vigencia: '',
      status: 0 // Inicializa status como un número
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
      const obtenerCupon = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/cupones/${id}`);
          setCupon({
            ...response.data,
            status: response.data.status === 1 ? 1 : 0 // Asegúrate de que status sea un número
          });
        } catch (error) {
          console.error(`Error al obtener el cupón con ID ${id}:`, error);
        }
      };
  
      obtenerCupon();
    }, [id]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCupon(prevState => ({
        ...prevState,
        [name]: name === 'status' ? (value === 'activo' ? 1 : 0) : value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`http://localhost:3001/cupones/${id}`, cupon);
        if (response.status === 200) {
          setMessage('Cupón actualizado exitosamente.');
          setTimeout(() => navigate('/cupones'), 2000);
        }
      } catch (error) {
        console.error(`Error al actualizar el cupón con ID ${id}:`, error);
        setMessage('Error al actualizar el cupón.');
      }
    };
  

  return (
    <div className="pl-72 pr-24 pt-20 carrito-page flex flex-col min-h-screen shadow-lg">
       <NavbarAdmin />
      <Sidebar/>
        <div className="carrito-container mx-4 my flex-1">
        <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Editar suscripcion</h2>
          <p className="pl-10 font-light  ml-4 text-center text-1xl pb-10">Por favor, ingrese los datos que desea modificar.</p>
        <div className="carrito-container mx-4 flex-1">

        {message && (
  <div className={`py-5 px-6 mb-4 rounded relative ${message.includes('exitosamente') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
    <strong className="font-bold">{message.includes('exitosamente') ? '¡Éxito! ' : 'Error!'}</strong>
    <p className="block sm:inline">{message}</p>
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
        Vigencia
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
       
      </div> <div className="m-10">
       <FooterAdmin />
       </div>
      </div>
  );
};

export default EditarSub;
