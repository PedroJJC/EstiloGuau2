import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Navbar from "../../Components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { FiEdit } from "react-icons/fi";

const PerfilVendedor = () => {
  const { userData } = useContext(UserContext);
  const [vendedor, setVendedor] = useState(null);

  useEffect(() => {
    const fetchVendedor = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/vendedor/${userData.idUsuario}`);
        setVendedor(response.data);
      } catch (error) {
        console.error('Error al obtener el perfil del vendedor:', error);
      }
    };

    fetchVendedor();
  }, [userData.idUsuario]);

  if (!vendedor) {
    return <div className="min-h-screen flex items-center justify-center font-roboto">Cargando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-28 px-10">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg mb-8">
          <h1 className="text-5xl font-bold text-white text-center">Bienvenido, {vendedor.nom_empresa}!</h1>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
          <div className="flex-grow">
            <h2 className="text-3xl font-bold">{vendedor.nom_empresa}</h2>
            <p className="text-lg">Dirección: {vendedor.direccion}</p>
            <p className="text-lg">Teléfono: {vendedor.telefono}</p>
            <p className="text-lg">País: {vendedor.pais}</p>
            <p className="text-lg">Estado: {vendedor.estado}</p>
            <p className="text-lg">Código Postal: {vendedor.codigo_postal}</p>
            <p className="text-lg">RFC: {vendedor.rfc}</p>
          </div>
            <Link to={`/editar-vendedor/${vendedor.idVendedor}`} className="ml-4">
                <FiEdit className="h-10 w-10 text-black hover:text-custom cursor-pointer" />
            </Link>
        </div>

        <h2 className="text-5xl font-semibold mb-4">Información Adicional</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Ventas Realizadas</h3>
            <p className="text-3xl">0</p> {/* Sustituir con datos reales */}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Suscripciones Activas</h3>
            <p className="text-3xl">0</p> {/* Sustituir con datos reales */}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Clientes</h3>
            <p className="text-3xl">0</p> {/* Sustituir con datos reales */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilVendedor;
