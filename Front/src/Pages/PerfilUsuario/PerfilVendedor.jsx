import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Navbar from "../../Components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { FiEdit } from "react-icons/fi";
import Footer from "../../Components/Footer/Footer";

const PerfilVendedor = () => {
  const { userData } = useContext(UserContext);
  const [vendedor, setVendedor] = useState(null);
  const [totalCompras, setTotalCompras] = useState(null);
  const [nombreSuscripcion, setNombreSuscripcion] = useState('');
  const [totalClientes, setTotalClientes] = useState(0);

  useEffect(() => {
    const fetchVendedor = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/vendedor/${userData.idUsuario}`);
        //console.log(response.data);
        setVendedor(response.data);
      } catch (error) {
        console.error('Error al obtener el perfil del vendedor:', error);
      }
    };
    const fetchTotalCompras = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/total-compras/${userData.idUsuario}`);
        //console.log(response.data); // Muestra la respuesta para depurar
        setTotalCompras(response.data[0].total_compras); // Asigna el total de compras al estado
      } catch (error) {
        console.error('Error al obtener el total de compras:', error);
      }
    };
    const fetchSuscripcionName = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/suscripcionname/${userData.idUsuario}`);
        //console.log(response.data); // Muestra la respuesta para depurar
        if (response.data.length > 0) {
          setNombreSuscripcion(response.data[0].nombre_sub); // Asigna el nombre de la suscripción al estado
        } else {
          setNombreSuscripcion('No suscripción encontrada'); // Mensaje si no hay suscripción
        }
      } catch (error) {
        console.error('Error al obtener la suscripción:', error);
      }
    };
    const fetchTotalClientes = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/total-clientes/${userData.idVendedor}`);
       // console.log(response.data); // Muestra la respuesta para depurar
        setTotalClientes(response.data[0].total_clientes); // Asigna el total de clientes al estado
      } catch (error) {
        console.error('Error al obtener el total de clientes:', error);
      }
    };
  
    fetchTotalClientes();
    fetchSuscripcionName();
    fetchTotalCompras();
    fetchVendedor();
  }, [userData.idUsuario]);

  if (!vendedor) {
    return <div className="min-h-screen flex items-center justify-center font-roboto">Cargando perfil...</div>;
  }

  return (
    <div className="min-h-auto bg-gray-100">
      <Navbar />
      <div className="pt-32 px-56">
        <div className="bg-gradient-to-r from-custom to-second p-6 rounded-lg mb-8">
          <h1 className="text-5xl font-bold text-black text-center">Bienvenido, {vendedor.nom_empresa}!</h1>
        </div>

        <div className="bg-white shadow-lg rounded-md p-6 mb-8 flex items-center">
          <div className="flex-grow">          
            <h1 className="text-3xl font-thin p-2 pl-4">Datos de mi empresa:</h1>

            <div className="flex justify-center items-center">
            <div className=" flex  shadow-md w-1/2">
              <div className=" m-10 ">
              <p className="text-2xl font-semibold">Dirección: <span className="font-normal">{vendedor.direccion}</span></p>
            <p className="text-2xl font-semibold">Teléfono: <span className="font-normal">{vendedor.telefono}</span> </p>
            <p className="text-2xl font-semibold">País: <span className="font-normal">{vendedor.pais}</span> </p>
              </div>
              <div className=" m-10 ">
              <p className="text-2xl font-semibold">Estado: <span className="font-normal">{vendedor.estado}</span> </p>
            <p className="text-2xl font-semibold">Código Postal: <span className="font-normal">{vendedor.codigo_postal}</span> </p>
            <p className="text-2xl font-semibold">RFC: <span className="font-normal">{vendedor.rfc}</span> </p>
                </div>     
                <div className="">
          <Link to={`/editar-vendedor/${vendedor.idVendedor}`} className="">
                <FiEdit className="h-10 w-10 text-black hover:text-custom cursor-pointer" />
            </Link>

          </div>         
            </div>
            </div>
          </div>
        </div>

        <h2 className="text-5xl font-semibold mb-4">Información Adicional</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Ventas Realizadas</h3>
            <p className="text-3xl">{totalCompras !== null ? totalCompras : 'Cargando...'}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Suscripciones Activas</h3>
            <p className="text-3xl">{nombreSuscripcion}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Clientes</h3>
            <p className="text-3xl">{totalClientes}</p>
          </div>
        </div>
      </div>
      <div className="">
      <Footer/>
      </div>
    </div>
  );
};

export default PerfilVendedor;
