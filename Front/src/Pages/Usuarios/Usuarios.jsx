import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';
import FooterAdmin from "../../Components/Footer/FooterAdmin";
import Sidebar from '../../Components/Sidebar/Sidebar';

const Usuarios = () => {
 

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/usuariosget');
      setUsuarios(response.data);
      //console.log(productos)
    } catch (error) {
      console.error('Error al obtener los usuario:', error);
    }
  };

  const eliminarUsuario = async (idUsuario) => {
    try {
      await axios.delete(`http://localhost:3001/usuariodelete/${idUsuario}`);
      setUsuarios(usuarios.filter(usuario => usuario.idUsuario !== idUsuario));
    } catch (error) {
      console.error(`Error al eliminar el usuario con ID ${idUsuario}:`, error);
    }
  };

  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
       <NavbarAdmin />
      <Sidebar/>
      
   
      <div className="carrito-container mx-4  flex-1 ">
      <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Usuarios </h2>
           <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl ">Resumen de todas los usuarios registrados</p>
        <div className="flex justify-start pb-10">
        <Link to="/usuarios/formulario">
            <button className="bg-custom border  hover:bg-second text-black font-medium py-2 px-4 rounded">
            Agregar Usuario
            </button>
        </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-black">
            <thead className="bg-custom text-black text-medium">
              <tr>
                {/* border-b border-white-900 */}
                <th className="py-3 px-4 text-center border border-white-900">Fecha de creación</th>
                <th className="py-3 px-4 text-center border border-white-900">Foto</th>
                <th className="py-3 px-4 text-center border border-white-900">Nombre</th>
                <th className="py-3 px-4 text-center border border-white-900">Descripción</th>
                <th className="py-3 px-4 text-center border border-white-900">Rol</th>
                <th className="py-3 px-4 text-center border border-white-900">Editar</th>
                <th className="py-3 px-4 text-center border border-white-900">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {usuarios.map(usuario => (
                <tr key={usuario.idUsuario}>
                  <td className="py-3 px-4 border border-gray-300">
                    {new Date(usuario.fecha_creacion).toISOString().split('T')[0]}
                  </td>
                  <td className="py-2 px-2 text-center border border-gray-300">
                    {usuario.foto && (
                      <img 
                      src={`http://localhost:3001/images/${usuario.foto.split(',')[0]}`}  // Muestra solo el primer archivo
                      alt="Producto" 
                      className="w-20 h-20 object-cover rounded mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 border border-gray-300">{usuario.nombre + ' '+ usuario.apellido}</td>
                  <td className="py-3 px-4 border border-gray-300">{usuario.email}</td>
                  <td className="py-3 px-4 border border-gray-300">{usuario.rol}</td>
                  <td className="py-3 px-4 text-center border border-gray-300">
                    <Link to={`/usuarios/editar/${usuario.idUsuario}`}>
                      <button className="bg-[#CDD5AE] border  hover:bg-second text-black font-bold rounded-md px-4 py-2">
                        Editar
                      </button>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-center border border-gray-300">
                    <button
                      className="bg-white-500 hover:text-second text-custom font-bold py-1 px-2 rounded w-22"
                      onClick={() => eliminarUsuario(usuario.idUsuario)}
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
                      <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                    </svg>

                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                    No hay usuarios disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="m-10">
       <FooterAdmin />
       </div>
    </div>
  );
};

export default Usuarios;
