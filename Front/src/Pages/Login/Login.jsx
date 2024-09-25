import React from "react";
import { useState, useContext  } from "react";
import Axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';


const Login = () => {
//#region  Consulta y manejo de consulta
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const { setIdUsuarioYRol } = useContext(UserContext);
  const navigate = useNavigate();

  const iniciar = (e) => {
    e.preventDefault();
    if (correo.length===0 || password.length===0){
        alert("Todos los campos son obligatorios");
     }
     else{
        Axios.post("http://localhost:3001/Login",{
            email:correo,
            password:password
           }).then(response =>{
            //Maneja la respuesta del servidor aqui
           if(response.status === 200){
            const user = response.data.user;
          {/*alert(response.data.message);*/}
          //navigate('/')
          console.log('Usuario autenticado:', user);
          setIdUsuarioYRol(user.idUsuario, user.idRol, user.nombre, user.email);
          if (user.idRol === 1) {
            navigate('/');
          } else if (user.idRol === 2 || user.idRol ===3) {
            navigate('/dashboard');
          } else {
            // Manejar otros roles si es necesario
          }

          // Aquí puedes manejar el rol del usuario
          if (user.idRol === 1) {
            console.log(user);
            // Redirigir a la página de administrador, etc.
          } else {
            console.log('Usuario con rol estándar');
            // Redirigir a la página de usuario estándar, etc.
          }
        }
           }).catch(error => {
            // Maneja el error aquí
            if (error.response && error.response.status === 401) {
              alert('Credenciales incorrectas');
            } else {
              console.error(error);
              alert('Ocurrió un error. Intente nuevamente más tarde.');
            }
          });
        }
      }

//#endregion  Consulta y manejo de consulta

  return (
  <div className="flex w-full h-screen">
            <div className="bg-custom w-2/2">
              <img className="object-cover h-full w-full"
              src="/images/bannerLYR.png"
              alt="">
              </img>
            </div>

           <div className="w-1/2 flex flex-col justify-center items-center">

            <div className="w-8/12">
            <img className="w-40 mx-auto m-10" src="/images/logo.png" alt=""/>
            <h1 className="font-roboto text-5xl font-extrabold mb-8 text-center ">Inicia Sesión</h1>    
     
            
            <div className="form group flex flex-col m-10">
              <label className="text-roboto text-3xl font-bold text-left pb-4"> Correo electronico:
                <span className="text-red-600"> *</span></label> 
              <input className="rounded-xl border-2 border-gray-300 bg-gray-200 p-2"
              placeholder=" correo@gmail.com" 
              onChange={(e)=> setCorreo(e.target.value)} type="text"/>
              </div>

              
              <div className="form-group flex flex-col m-10">
              <label className="text-roboto text-3xl font-bold text-left pb-4">Contraseña:
                <span className="text-red-600"> *</span></label> 
              <input 
              placeholder=" ******** "
              className="rounded-xl border-2 border-gray-300 bg-gray-200 p-2"
              onChange={(e)=> setPassword(e.target.value)} type="password"/>
              </div>
           </div>
           
           <div className="form-group flex flex-col">
              <button className="bg-custom w-auto text-roboto font-bold m-5 p-2 hover:bg-second" 
              onClick={iniciar}>Iniciar sesón</button>  

              <label className="redirectregister">¿Aún no tienes cuenta?

              <Link to="/Registro" >
                <span  className="text-blue-600"> Registrate</span>
              </Link>  

              </label>
              </div>
         
                   </div>
           </div>

  
        
  )
}
export default Login;