import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';
import { UserContext } from '../../Context/UserContext';

const FormularioUsuario = () => {
  const { userData } = useContext(UserContext);

  useEffect(() => {
    obtenerRoles();
    const today = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      fecha_creacion: today
    }));
  }, []);

  const obtenerRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/all-rol');
      setRoles(response.data);
      //console.log(response.data)
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };
  const [roles, setRoles] = useState([]);
  const [usuario, setUsuario] = useState({
    idRol: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fecha_creacion: '',
  });

  const [agregado, setAgregado] = useState(false);
  //const [rutaProducto, setRutaProducto] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleFileChange = (e) => {
    setUsuario({ ...usuario, foto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(usuario)
      const formData = new FormData();
      formData.append('idRol', usuario.idRol);
      formData.append('nombre', usuario.nombre);
      formData.append('apellido', usuario.apellido);
      formData.append('email', usuario.email);
      formData.append('password', usuario.password);
      formData.append('fecha_creacion', usuario.fecha_creacion);
     
      const response = await axios.post('http://localhost:3001/new-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
       
      });


      if (response.status === 201) {
        setAgregado(true);
        
        // Redirigir a la página de productos después de 2 segundos
        setTimeout(() => {
          setAgregado(false); // Limpiar el mensaje de éxito después de la redirección
          navigate('/usuarios')

        }, 2000);
      }
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
    }
  };



  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
       <Navbar />
      <Sidebar />
      
        <div className="carrito-container mx-5 my-8 flex-1 ">
          <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Nuevo usuario</h2>
          <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl pb-10">Por favor, ingrese los datos solicitados del usuario, recuerde que todos lo campos son necesarios
            <span className="text-red-700 text-3xl">*</span></p>
            
          {agregado && (
            <div className="bg-green-100 border border-green-400 text-green-700 py-5 mx-32 rounded relative mb-4" role="alert">
              <strong className="font-bold">¡Usuario agregado correctamente!</strong>
              {/*<p className="block sm:inline">Puedes ver el producto <a href={rutaProducto} className="text-blue-500 hover:underline">aquí</a>.</p>*/}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto h-auto space-y-6">
            <div className="grid grid-cols-2 gap-6 text-left h-auto">
              {/*fecha_creacion*/}
              <div className="mb-6">
                <label htmlFor="fecha_creacion" className="block text-gray-700 font-bold mb-2">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  id="fecha_creacion"
                  name="fecha_creacion"
                  value={usuario.fecha_creacion}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"                  
                  disabled
                />
              </div>

              {/*Nombre*/}
              <div className="mb-6">
                <label htmlFor="nombre" className="block text-gray-700 font-bold mb-2">
                  Nombre (s)
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese el nombre del producto"
                />
              </div>
              {/*Apellido*/}
              <div className="mb-6">
                <label htmlFor="apellido" className="block text-gray-700 font-bold mb-2">
                  Apellidos 
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={usuario.apellido}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese el nombre del producto"
                />
              </div>
              {/*email*/}
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={usuario.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese la email"
                />
              </div>
              {/*email*/}
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={usuario.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese el password"
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
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-custom hover:bg-second text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Agregar
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
       <Footer />
       </div>
      </div>
  );
};

export default FormularioUsuario;
