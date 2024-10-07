import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Navbar from "../../Components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { FiEdit } from "react-icons/fi";

const PerfilUsuario = () => {
  const { userData } = useContext(UserContext);
  const [usuario, setUsuario] = useState(null);
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/usuarioget/${userData.idUsuario}`);
        setUsuario(response.data);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUsuario();
  }, [userData.idUsuario]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/compras/${userData.idUsuario}`);
        setCompras(response.data);
      } catch (error) {
        console.error('Error al obtener las compras:', error);
      }
    };

    fetchCompras();
  }, [userData.idUsuario]);

  if (!usuario) {
    return <div className="min-h-screen flex items-center justify-center font-roboto">Cargando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-28 px-10">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg mb-8">
          <h1 className="text-5xl font-bold text-white text-center">Bienvenido, {usuario.nombre}!</h1>
        </div>
  
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
          <img src={`http://localhost:3001/images/${usuario.foto}`} alt="Usuario" className="rounded-full h-40 w-40 object-cover mr-6" />
          <div className="flex-grow">
            <h2 className="text-3xl font-bold">{usuario.nombre} {usuario.apellido}</h2>
            <p className="text-lg">Email: {usuario.email}</p>
            <p className="text-lg">Contraseña: {'*'.repeat(usuario.password.length)}</p>
          </div>
          <Link to={`/formUs`} className="ml-4">
            <FiEdit className="h-10 w-10 text-black hover:text-custom cursor-pointer" />
          </Link>
        </div>
  
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Compras Realizadas</h3>
            <p className="text-3xl">{compras.length}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Suscripciones Activas</h3>
            <p className="text-3xl">3</p> {/* Sustituir con datos reales */}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Puntos de Fidelidad</h3>
            <p className="text-3xl">120</p> {/* Sustituir con datos reales */}
          </div>
        </div>
  
        <h2 className="text-5xl font-semibold mb-4">Últimas Compras</h2>
        {compras.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compras.map(compra => (
              <div key={compra.idCompra} className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
                <img src={`http://localhost:3001/images/${compra.foto}`} className="h-24 w-24 rounded-full mb-4 mx-auto" alt="Producto" />
                <h3 className="font-bold">{compra.descripcion_producto}</h3>
                <p>Precio: ${compra.precio}</p>
                <p>Talla: {compra.talla}</p>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Ver Detalles</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No has realizado compras aún.</p>
        )}
      </div>
    </div>
  );  
};

export default PerfilUsuario;
