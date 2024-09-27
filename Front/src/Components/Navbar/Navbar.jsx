import React, { useContext, useState } from "react";
import { UserContext } from '../../Context/UserContext';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import './Navbar.css';
import { Dropdown, Navbar } from "flowbite-react";
import ShoppingCart from '../ShoppingCart/ShoppingCart'
import Logo from "../../img/Logo.png"



const Component = () => {
  const { userData, logout } = useContext(UserContext);
  const { idUsuario, idRol } = userData;
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const location = useLocation();
  const isLandingPage = location.pathname === "/"; 


  const handleLogout = () => {
    logout();
  };

  return (
    
    <section>
      <Navbar fluiComponentd rounded>
      <div
        className={`fixed w-full z-20 top-0 start-0 border-b p-4 flex justify-between items-center shadow-md ${
          isLandingPage ? "bg-black border-gray-700" : "bg-white border-gray-200"
        }`}
      >         
      <Navbar.Brand className="">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/">
                <img className=" block h-20 w-auto" src={Logo} alt="" />
              </Link>
            </div>
          </Navbar.Brand>

                  {/* Encabezado en el centro */}
                  <div className="text-center flex-grow">
            <div className="text-white text-5xl font-semibold tracking-widest font-roboto">
              ESTILO GUAU
            </div>
          </div>

          {/* Elementos a la derecha */}
          <div className=" flex items-center space-x-4">
             {/* Cart button */}
            <div className="  flex items-center space-x-4 ">
              <button onClick={handleOpen} className={`h-9 w-9 ${isLandingPage ? "bg-black" : "" }`}  aria-hidden="true">
                <ShoppingCartIcon  className={`h-9 w-9 ${isLandingPage ? "text-white" : "text-red-500"}`}
  aria-hidden="true" />
              </button>
              <ShoppingCart isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
            {/*Tienda*/}
            <Link to="/Tienda">
            
              <button className={`h-9 w-9 ${isLandingPage ? "bg-black" : "" }`}  aria-hidden="true">
                <span className="sr-only">Tienda</span>
                <ShoppingBagIcon
  className={`h-9 w-9 ${isLandingPage ? "text-white" : "text-red-500"}`}
  aria-hidden="true"
/>
              </button>
            </Link>
            <div className="flex md:order-2">

              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Bars3Icon  className={`h-9 w-9 ${isLandingPage ? "text-white" : "text-red-500"}`}
                  aria-hidden="true" strokeWidth={3} />
                }
              >
                 {idUsuario ? (
                <Dropdown.Header>
                  <span className="block text-sm text-center font-semibold">¡Bienvenido (a)!</span>
                  <span className="block text-sm text-center font-normal">{userData.nombre || "Nombre no disponible"}</span> {/* Mostrar nombre */}
                  <span className="block truncate text-sm font-light text-center">{userData.email || "Email no disponible"}</span> {/* Mostrar email */}
                </Dropdown.Header>
                 ) :
                 <Dropdown.Header>
                <span className="block text-sm">¡Bienvenido (a)!</span>
                </Dropdown.Header>
                }

                {/**Servicios */}
                <Dropdown.Item className="hover:bg-custom">
                <Link
                      to="/Suscripciones"

                    >
                      Suscripciones
                    </Link>
                </Dropdown.Item>
                
                {/*Perfil Usuario*/}
               {idUsuario ? (
                 <Dropdown.Item className="hover:bg-custom">
                  
                    <Link
                      to="/PerfilUsuario"

                    >
                      Mi perfil
                    </Link>
                 
                </Dropdown.Item> 
              ) : null}


               
                 {/**Panel de administracion */} 
                 {(idRol == 2 || idRol ==3) && (
                  <Dropdown.Item className="hover:bg-custom">
                    
                      <Link
                      to="/dashboard"
                    >
                      Dashboard
                    </Link>
                    
                  </Dropdown.Item> 
                )}               
               
                <Dropdown.Divider />
                 {/*Logout*/}
                 <Dropdown.Item className="hover:bg-custom">
                  {idUsuario ? (
                    <Link
                      to="/"
                      onClick={handleLogout}
                    
                    >
                      Cerrar sesión
                    </Link>
                  ) : (
                    <Link
                      to="/Login"
                      className=""
                    >
                      Iniciar sesión
                    </Link>
                  )}
                </Dropdown.Item>
              </Dropdown>
              
              <Navbar.Toggle />
            </div>
          </div>
        </div>
      </Navbar>
    </section>
  );
};

export default Component;
