import React , { useContext, useState }from "react";
import { UserContext } from '../../Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Graficas from '../../Components/Graficas/Graficas';
import GraficasSA from '../../Components/Graficas/Graficas';
import FooterAdmin from '../../Components/Footer/FooterAdmin';


const Dashboard = () => {
  const { userData, logout } = useContext(UserContext);
  const { idRol } = userData;


  return (
    <div className="pl-72 pt-12 pr-20 carrito-page flex flex-col min-h-screen shadow-lg">
       <NavbarAdmin />
       <div className="">
           <Sidebar />   
       </div>
        <div>
        {idRol === 3 ? (
          <GraficasSA /> // Mostrar GraficasSA si el idRol es 3
        ) : idRol === 2 ? (
          <Graficas /> // Mostrar Graficas si el idUsuario es 2
        ) : (
          <div>No tienes acceso a esta vista.</div>
        )}        </div>
        <div className="">
           <FooterAdmin/>
        </div>
       
      </div>
  );
};

export default Dashboard;
