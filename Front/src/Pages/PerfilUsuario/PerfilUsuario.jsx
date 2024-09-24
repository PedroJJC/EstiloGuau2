import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Navbar from "../../Components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { FiEdit } from "react-icons/fi";

const PerfilUsuario = () => {
  const { userData } = useContext(UserContext);
  const [usuario, setUsuario] = useState(null);
  const [compras, setCompras] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/usuarioget/${userData.idUsuario}`);
        if (!response.data) {
          throw new Error('Usuario no encontrado');
        }
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
        if (!response.data) {
          throw new Error('No se pudieron obtener las compras');
        }
        setCompras(response.data);
      } catch (error) {
        console.error('Error al obtener las compras:', error);
        // Manejo de errores (puedes mostrar un mensaje al usuario, etc.)
      }
    };

    fetchCompras();
  }, [userData.idUsuario]); // Dependencia añadida

  if (!usuario) {
    return <div className="min-h-screen flex items-center justify-center font-roboto">Cargando perfil...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex-row flex justify-right pt-20">
        {/*{userData.idRol}*/}
        <p className="pt-10 text-start font-roboto font-semibold text-5xl ml-10">Mi Cuenta</p>
      </div>
      <div className="flex justify-end mr-16">
        <Link to={`/formUs`}>
          <FiEdit className="h-10 w-10 text-black hover:text-custom cursor-pointer" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mx-8">
        <div className="col-span-2 p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 p-4">
              <p className="text-left text-3xl font-bold pb-2 font-roboto">Nombre:</p>
              <p className="text-left text-2xl font-roboto">{usuario.nombre} {usuario.apellido}</p>
            </div>
            <div className="col-span-2 p-4">
              <p className="text-left text-3xl font-bold font-roboto pb-2">Contraseña:</p>
              <p className="text-left text-2xl font-roboto">{'*'.repeat(usuario.password.length)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 p-4">
              <p className="text-left text-3xl font-bold pb-2 font-roboto">Email:</p>
              <p className="text-left text-2xl font-roboto">{usuario.email}</p>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <p className="text-left text-3xl font-bold font-roboto pb-2">Foto:</p>
          <img src={`http://localhost:3001/images/${usuario.foto}`} alt="Usuario" className="rounded-full h-60 w-60 object-cover" />
          {/*<img src={`${usuario.foto}`} className="round ed-full h-60 w-60 object-cover" />*/}
        </div>
      </div>

      <div className="flex-row flex justify-right pt-4">
        <p className="text-start font-roboto font-semibold text-5xl ml-10 pb-5">Últimas compras</p>
      </div>

      {/* Aquí debes mostrar las compras, si las tienes disponibles en el estado `compras` */}
      {compras && (
        <div className="grid grid-cols-3 gap-4 mx-8 ">
          {compras.map(compra => (
            <div key={compra.idCompra} className="flex flex-row p-4 border shadow-xl border-gray-300 rounded">
              <img src={`http://localhost:3001/images/${compra.foto}`}
                className=" h-28 rounded-full p-3"></img>
              <div className='flex flex-col text-left' >
                <p>Producto: {compra.descripcion_producto}</p>
                <p>Precio: ${compra.precio}</p>
                <p>Talla: {compra.talla}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PerfilUsuario;
