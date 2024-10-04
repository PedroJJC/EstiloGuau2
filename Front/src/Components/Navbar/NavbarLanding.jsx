import React, { useContext, useState } from "react";
import { UserContext } from '../../Context/UserContext';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import './Navbar.css';
import { Dropdown, Navbar } from "flowbite-react";
import ShoppingCart from '../ShoppingCart/ShoppingCart'
import Logo from "../../img/Logo.png"


const NavbarLanding = () => {
  const { userData, logout } = useContext(UserContext);
  const { idUsuario, idRol } = userData;
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);


  const handleLogout = () => {
    logout();
  };

  return (
    <section>
      <Navbar fluid rounded>
      <div className="bg-black fixed w-full z-20 top-0 start-0 border-b p-4 flex justify-between items-center border-gray-700 shadow-md">          <Navbar.Brand className="">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/">
                <img className=" block h-20 w-auto" src={Logo} alt="" />
              </Link>
              {/* search button */}
              <Link to="/">
                <button className=" bg-black flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring- ">
                  <span className="sr-only">Open user menu</span>
                  <MagnifyingGlassIcon className="h-9 w-9 text-red-500" aria-hidden="true" strokeWidth={3} />
                </button>
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
              <button onClick={handleOpen} className="bg-black focus:outline-none">
                <ShoppingCartIcon className="h-8 w-8 text-red-500" aria-hidden="true" />
              </button>
              <ShoppingCart isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
            {/*Tienda*/}
            <Link to="/Tienda">
              <button className=" bg-black flex text-sm ">
                <span className="sr-only">Open user menu</span>
                <ShoppingBagIcon className="h-9 w-9 text-red-500" aria-hidden="true" />
              </button>
            </Link>
            <div className="flex md:order-2">

              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Bars3Icon className="h-9 w-9 text-red-500" aria-hidden="true" strokeWidth={3} />
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



        {/*<Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>*/}
      </Navbar>
    </section>
  );
};

export default NavbarLanding;
