import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import FooterAdmin from "../../Components/Footer/FooterAdmin";
import Sidebar from '../../Components/Sidebar/Sidebar';


const EditarUsuario = () => {
  const { id } = useParams(); // Extraer el ID del producto desde la URL
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState(''); // Estado para mensajes de éxito/error
  const [currentImage, setCurrentImage] = useState([]); // Estado para almacenar la URL de la imagen actual
  const [agregado, setAgregado] = useState(false);
  const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory

  useEffect(() => {
    
    
    const obtenerRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/all-rol');
        setRoles(response.data);
        //console.log(response.data)
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
    obtenerRoles();
    const obtenerUsuario = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/usuarioget/${id}`);
        setUsuario(response.data);
        const fotos = response.data.foto.split(',');
        //console.log(fotos)
        setCurrentImage(fotos); // Establecer la URL de la imagen actual
      } catch (error) {
        console.error(`Error al obtener el producto con ID ${id}:`, error);
      }
    };

    obtenerUsuario(); 

    setUsuario((prevUsuario) => ({
      ...prevUsuario
    }));
  }, [id]);
  
  const [usuario, setUsuario] = useState({
    idRol: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fecha_creacion: '',
    foto: null
    });

/*   const obtenerProducto = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/productos/${id}`);
      setProducto(response.data);
      setCurrentImage(response.data.foto); // Establecer la URL de la imagen actual
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error);
    }
  }; */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleFileChange = (e) => {
    setUsuario({ ...usuario, foto: e.target.files[0] });
  };


  const handleRemoveImage = async () => {
    try {
      await axios.delete(`http://localhost:3001/productos/${id}/foto`);
      setUsuario({ ...usuario, foto: '' }); // Actualizar el estado localmente después de eliminar la imagen
      setMessage('Imagen eliminada exitosamente.');
    } catch (error) {
      console.error(`Error al eliminar la imagen del producto con ID ${id}:`, error);
      setMessage('Error al eliminar la imagen del producto.');
    }
  };  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(usuario).forEach(key => {
      formData.append(key, usuario[key]);
    });

    try {
      await axios.put(`http://localhost:3001/usuarioupdate/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAgregado(true);
      setMessage('Producto actualizado exitosamente.');
      setTimeout(() => {
        setAgregado(false);
      navigate('/productos'); 
    }, 2000); // Navegar a la lista de productos después de 2 segundos
    } catch (error) {
      console.error(`Error al actualizar el usuario con ID ${id}:`, error);
      setMessage('Error al actualizar el usuario.');
    }
  };


  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
      <NavbarAdmin/>
       <Sidebar/>
      
      <div className="carrito-container mx-4 flex-1 ">
        <h2 className="pl-10 font-bold mb-4 ml-4  text-center text-4xl">Editar usuario</h2>
      <p className="pl-10 font-light mb-8 ml-4 text-center text-1xl">Por favor, ingrese los datos que desea modificar.</p>
      {agregado && (
            <div className="bg-green-100 border border-green-400 text-green-700 py-5 mx-96 rounded relative mb-4" role="alert">
              <strong className="font-bold">Usuario editado exitosamente!</strong>
              {/*<p className="block sm:inline">Puedes ver el producto <a href={rutaProducto} className="text-blue-500 hover:underline">aquí</a>.</p>*/}
            </div>
          )}        
          <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">

         {/*fecha_ingreso*/}
         <div className="mb-4">
            <label htmlFor="fecha_creacion" className="block text-gray-700 font-bold mb-2">
              Fecha ingreso
            </label>
            <input
              type="text"
              id="fecha_creacion"
              name="fecha_creacion"
              value={usuario.fecha_creacion ? usuario.fecha_creacion.split('T')[0] : ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese el SKU del producto"
              disabled
            />
          </div>

            {/*Roles*/}
            <div className="mb-6">
                <label htmlFor="idRol" className="block text-gray-700 font-bold mb-2">
                  Rol del usuario
                </label>
                <select
                  type="number"
                  id="idRol"
                  name="idRol"
                  value={usuario.idRol}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >

                  <option value="" disabled>Selecciona el rol</option>
                  {roles.map((rol) => (
                    <option key={rol.idRol} value={rol.idRol}>
                      {rol.rol}
                    </option>
                  ))}
                </select>
              </div>

          <div className="mb-4">
            <label htmlFor="usuario" className="block text-gray-700 font-bold mb-2">
              Nombre del usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={usuario.nombre + ' ' + usuario.apellido}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese el nombre del usuario"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese el imail"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-custom hover:bg-second text-black font-bold py-2 mt-5 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar
            </button>
            <div className="text-right items-center">
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
       <FooterAdmin />
       </div>
    </div>
  );
};

export default EditarUsuario;
