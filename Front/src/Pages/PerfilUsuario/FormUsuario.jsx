import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from "../../Components/Navbar/Navbar";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';



export const FormUsuario = () =>{
    const { userData } = useContext(UserContext);
    //const { idUsuario } = userData;
    const [usuario, setUsuario] = useState({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      foto: null
    });
    const [message, setMessage] = useState(''); // Estado para mensajes de éxito/error
    const [currentImage, setCurrentImage] = useState(''); // Estado para almacenar la URL de la imagen actual
  
    const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory
  
    useEffect(() => {
      const obtenerUsuario = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/usuarioget/${userData.idUsuario}`);
          setUsuario(response.data);
          setCurrentImage(response.data.foto); // Establecer la URL de la imagen actual
        } catch (error) {
          console.error(`Error al obtener el usuario con ID ${userData.idUsuario}:`, error);
        }
      };
  
      obtenerUsuario(); 
  
    }, [userData.idUsuario]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
      };
    
      const handleFileChange = (e) => {
        setUsuario({ ...usuario, foto: e.target.files[0] });
      };
    
      const handleRemoveImage = async () => {
        try {
          await axios.delete(`http://localhost:3001/usuarioget/${userData.idUsuario}/foto`);
          setUsuario({ ...usuario, foto: '' }); // Actualizar el estado localmente después de eliminar la imagen
          setMessage('Imagen eliminada exitosamente.');
        } catch (error) {
          console.error(`Error al eliminar la imagen del usuario con ID ${userData.idUsuario}:`, error);
          setMessage('Error al eliminar la imagen del usuario.');
        }
      };  
      
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(usuario).forEach(key => {
          formData.append(key, usuario[key]);
        });
    
        try {
          await axios.put(`http://localhost:3001/usuarioupdate/${userData.idUsuario}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setMessage('usuario actualizado exitosamente.');
          //setTimeout(() => navigate('/perfilUsuario/${usuario.idUsuario}'), 2000);
          const url = `/PerfilUsuario`;
          navigate(url);
          } catch (error) {
          console.error(`Error al actualizar el usuario con ID ${userData.idUsuario}:`, error);
          setMessage('Error al actualizar el usuario.');
        }
      };

      const handleCancel = () => {
          const url = `/perfil-usuario`;
          navigate(url);
      };


  return(
    <form className="px-16" onSubmit={handleSubmit}>
    <div className='flex flex-row grid-cols-2 w-full'>
      <Navbar/>

      <div className="flex flex-col pt-32 w-1/2 px-10">
        <h2 className="text-start text-5xl font-roboto font-bold mb-6 pb-4">Editar perfil</h2>
        <div className="form-group flex flex-col py-5">
          <label className="text-roboto text-3xl font-bold text-left pb-1">Nombre(s):
            <span className="text-red-600"> *</span>
          </label>
          <input
            className="rounded-xl border-2 border-gray-300 bg-gray-200 p-3"
            type="text"
            id="nombre"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre del usuario"
          />
        </div>

        <div className="form-group flex flex-col py-5">
          <label className="text-roboto text-3xl font-bold text-left pb-1">Apellidos:
            <span className="text-red-600"> *</span>
          </label>
          <input
            className="rounded-xl border-2 border-gray-300 bg-gray-200 p-3"
            type="text"
            id="apellido"
            name="apellido"
            value={usuario.apellido}
            onChange={handleChange}
            placeholder="Ingrese los apellidos del usuario"
          />
        </div>

        <div className="form-group flex flex-col py-5">
          <label className="text-roboto text-3xl font-bold text-left pb-1">Correo electrónico:
            <span className="text-red-600"> *</span>
          </label>
          <input
            className="rounded-xl border-2 border-gray-300 bg-gray-200 p-3"
            type="email"
            id="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            placeholder="Ingrese el correo electrónico del usuario"
          />
        </div>

        <div className="form-group flex flex-col py-5">
          <label className="text-roboto text-3xl font-bold text-left pb-1">Contraseña:</label>
          <input
            className="rounded-xl border-2 border-gray-300 bg-gray-200 p-3"
            type="password"
            id="password"
            name="password"
            value={usuario.password}
            onChange={handleChange}
            placeholder="Ingrese la nueva contraseña (opcional)"
            disabled
          />
        </div>
        <label className="text-roboto text-1xl font-medium text-left text-blue-500">¿Desea cambiar su contraseña?</label>
      </div>

      <div className="flex flex-col pt-32 items-center justify-center px-10">
        <div className="form-group flex flex-col py-5">
          <label className="text-roboto text-3xl font-bold text-left pb-1">Foto:</label>
          <div className="flex flex-col mb-4 ">
            {currentImage && (
              <div className="flex flex-col justify-center items-center mb-4 text-center">
                <img src={`http://localhost:3001/images/${currentImage}`} alt="usuario" className=" rounded-full h-96 w-96 object-cover " />
                <button type="button" onClick={handleRemoveImage} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline m-4">
                  Quitar foto
                </button>
              </div>
            )}
            <input
              type="file"
              id="foto"
              name="foto"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div >
        <div className="flex flex-row">
        <button           
          type="submit"
          className="bg-custom hover:bg-custom text-black font-medium py-2 px-4 mx-1 rounded focus:outline-none focus:shadow-outline"
        >
          Guardar
        </button>
        <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 mx-1 rounded focus:outline-none focus:shadow-outline"
              >
                Cancelar
              </button>
        </div>
      </div>
    </div>
  </form>
);
};
export default FormUsuario;