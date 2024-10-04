import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import FooterAdmin from "../../Components/Footer/FooterAdmin";
import Sidebar from '../../Components/Sidebar/Sidebar';
import { UserContext } from '../../Context/UserContext';

const Cupones = () => {
  const { userData } = useContext(UserContext);
  const { idRol, idUsuario } = userData; // Obtener idRol e idUsuario
  const [cupones, setCupones] = useState([]);

  // useEffect para obtener cupones dependiendo del rol
  useEffect(() => {
    const obtenerCupones = async () => {
      try {
        let url;
        if (idRol === 2) {
          url = `http://localhost:3001/cuponesxus/${idUsuario}`; // Ruta para idRol 2
        } else if (idRol === 3) {
          url = `http://localhost:3001/cupones`; // Ruta diferente para idRol 3
        }

        const response = await axios.get(url);
        setCupones(response.data);
      } catch (error) {
        console.error('Error al obtener los cupones:', error);
      }
    };

    obtenerCupones();
  }, [idRol, idUsuario]); // Dependencias actualizadas para que se ejecute al cambiar idRol

  // Función para eliminar cupon
  const eliminarCupon = async (idCupon) => {
    try {
      await axios.delete(`http://localhost:3001/cupones/${idCupon}`);
      setCupones(cupones.filter(cupon => cupon.idCupon !== idCupon));
    } catch (error) {
      console.error(`Error al eliminar el cupón con ID ${idCupon}:`, error);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Maneja casos de fecha nula o indefinida
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  return (
    <div className="">
      <div className="pl-72 pt-20  pr-24 carrito-page flex flex-col min-h-screen">
      <Navbar />
        <Sidebar/>
        

          <div className="carrito-container mx-4 flex-1 ">
          <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Cupones</h2>
           <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl ">Resumen de todas los cupones</p>
            <div className="text-left justify-start pb-10">
              <Link to="/cupones/formulario">
                <button className="bg-custom border hover:bg-second text-black font-medium py-2 px-4 rounded">
                  Agregar Cupón
                </button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse border border-black">
                <thead className="bg-custom text-black text-medium">
                  <tr>
                    <th className="py-3 px-4 text-center border border-white-900">Descuento</th>
                    <th className="py-3 px-4 text-center border border-white-900">Nombre cupón</th>
                    <th className="py-3 px-4 text-center border border-white-900">Fecha Registro</th>
                    <th className="py-3 px-4 text-center border border-white-900">Vigencia</th>
                    <th className="py-3 px-4 text-center border border-white-900">Status</th>
                    <th className="py-3 px-4 text-center border border-white-900">Editar</th>
                    <th className="py-3 px-4 text-center border border-white-900">Eliminar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {cupones.map(cupon => (
                    <tr key={cupon.idCupon}>
                      <td className="py-3 px-4 border border-gray-300">{cupon.cupon}</td>
                      <td className="py-3 px-4 border border-gray-300">{cupon.descripcion}</td>
                      <td className="py-3 px-4 border border-gray-300">{formatDate(cupon.fechaRegistro)}</td>
                      <td className="py-3 px-4 border border-gray-300">{formatDate(cupon.vigencia)}</td>
                      <td className="py-3 px-4 border border-gray-300">
                        <span className={`status-label ${cupon.status === 'activo' ? 'text-green-500' : 'text-red-500'} uppercase`}>
                            {cupon.status}
                        </span>
                     </td>
                      <td className="py-3 px-4 text-center border border-gray-300">
                        <Link to={`/cupones/editar/${cupon.idCupon}`}>
                          <button className="bg-custom border hover:bg-second text-black font-bold rounded-md px-4 py-2">
                            Editar
                          </button>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-center border border-gray-300">
                        <button
                          className="bg-white-500 hover:text-second text-custom font-bold py-1 px-2 rounded"
                          onClick={() => eliminarCupon(cupon.idCupon)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
                      <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                    </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cupones.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-4 px-6 text-center text-gray-500 border-gray-300">
                        No hay cupones disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="m-10">
       <FooterAdmin />
       </div>
    </div>
  );
};

export default Cupones;
