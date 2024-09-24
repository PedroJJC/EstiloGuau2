import React from "react";
import './Registro.css';
import { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

export const Registro = () =>{
  const [nombres, setNombres] = useState("");
  const [apellidos, setapelidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const add = (e) => {
    e.preventDefault();
    if (nombres.length===0 || apellidos.length===0 ||  correo.length===0 || password.length===0){
      alert("Todos los campos son obligatorios");
   }
   else 
   {
    Axios.post("http://localhost:3001/registro",{
      nombre:nombres,
      apellido:apellidos,
      email:correo,
      password:password
     }).then(()=>{
     navigate('/login')
      {/*alert("Usuario registrado");*/}
     });
   }
   }

  return(
<div className="flex w-full h-screen">
            

           <div className="w-1/2 flex flex-col justify-center items-center">

            <div className="w-8/12">
            <img className="w-40 mx-auto" src="/images/logo.png" alt=""/>
            <h1 className="font-roboto text-5xl font-extrabold text-center">Crea una nueva cuenta</h1>    
     
            <div className="form group flex flex-col m-5">
              <label className="text-roboto text-3xl font-bold text-left pb-1">Nombre(s):
                <span className="text-red-600"> *</span></label> 
              <input className="rounded-xl border-2 border-gray-300 bg-gray-200 p-1"
              placeholder="Introduzca aqui su nombre" 
              onChange={(e)=> setNombres(e.target.value)} type="text"/>
              </div>

              <div className="form group flex flex-col m-5">
              <label className="text-roboto text-3xl font-bold text-left pb-1">Apellidos:
                <span className="text-red-600"> *</span></label> 
              <input className="rounded-xl border-2 border-gray-300 bg-gray-200 p-1"
              placeholder="Introduzca aqui sus apellidos" 
              onChange={(e)=> setapelidos(e.target.value)} type="text"/>
              </div>

            <div className="form group flex flex-col m-5">
              <label className="text-roboto text-3xl font-bold text-left pb-1"> Correo electronico:
                <span className="text-red-600"> *</span></label> 
              <input className="rounded-xl border-2 border-gray-300 bg-gray-200 p-1"
              placeholder=" correo@gmail.com" 
              onChange={(e)=> setCorreo(e.target.value)} type="text"/>
              </div>

              
              <div className="form-group flex flex-col m-5">
              <label className="text-roboto text-3xl font-bold text-left pb-1">Contraseña:
                <span className="text-red-600"> *</span></label> 
              <input 
              placeholder=" ******** "
              className="rounded-xl border-2 border-gray-300 bg-gray-200 p-1"
              onChange={(e)=> setPassword(e.target.value)} type="password"/>
              </div>
           </div>


           <div className="form-group flex flex-col">
            <button className="bg-custom w-auto text-roboto font-bold m-5 p-1"
            onClick={add}>Crear cuenta</button> 
            <label className="redirectlogin">¿Ya tienes una cuenta?           
            <Link to="/Login"  >
             <span className="text-blue-600"> Inicia sesión</span> 
      </Link>      </label>            
            </div>          
         
              </div>
                   
              <div className="bg-custom w-1/2">
              <img className="object-cover h-full w-full"
              src="/images/bannerLYR.png"
              alt="">
              </img>
            </div>
           </div>

  )
}

export default Registro;