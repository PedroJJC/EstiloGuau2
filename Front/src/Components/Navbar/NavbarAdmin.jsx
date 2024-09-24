import React, { useContext } from "react";
import { UserContext } from '../../Context/UserContext';
import { Link } from 'react-router-dom';
import {  ShoppingBagIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import './Navbar.css';
import { Dropdown, Navbar } from "flowbite-react";
import Logo from "../../img/Logo.png"


const NavbarAdmin = () => {
  const { userData, logout } = useContext(UserContext);
  const { idUsuario, idRol } = userData;


  const handleLogout = () => {
    logout();
  };

  return (
    <section>
      <Navbar fluid rounded>
        <div className="bg-white fixed w-full z-20 top-0 start-0 border-b p-4 flex justify-between items-center border-gray-200 dark:border-gray-600 shadow-md">
          <Navbar.Brand className="">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/">
                <img className=" block h-20 w-auto" src={Logo} alt="" />
              </Link>
              {/* search button */}
              <Link to="/">
                <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white px-2">
                  <span className="sr-only">Open user menu</span>
                  <MagnifyingGlassIcon className="h-9 w-9 text-red-500" aria-hidden="true" strokeWidth={3} />
                </button>
              </Link>
            </div>
          </Navbar.Brand>
          {/* Elementos a la derecha */}
          <div className="flex items-center space-x-4">
            {/* Cart button 
            <Link to="/Tienda">
              <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                <span className="sr-only">Open user menu</span>
                <ShoppingCartIcon className="h-9 w-9 text-red-500" aria-hidden="true" />
              </button>
            </Link>*/}
            {/*Tienda*/}
            <Link to="/Tienda">
              <button className="flex text-sm ">
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
                <Dropdown.Header>
                
                  <span className="block text-sm">¡Bienvenido (a)!</span>
                  <span className="block text-sm">{userData.nombre || "Nombre no disponible"}</span> {/* Mostrar nombre */}
                  <span className="block truncate text-sm font-medium">{userData.email || "Email no disponible"}</span> {/* Mostrar email */}
                </Dropdown.Header>
                {/*Perfil Usuario*/}
                <Dropdown.Item className="hover:bg-custom">
                  {idUsuario ? (
                    <Link
                      to="/PerfilUsuario"

                    >
                      Mi perfil
                    </Link>
                  ) : null}
                </Dropdown.Item>

                 {/**Panel de administracion */}
                  <Dropdown.Item className="hover:bg-custom">
                    <Link
                      to="/dashboard"
                    >
                      Dashboard
                    </Link>
                  </Dropdown.Item>

                {/**Servicios */}
                <Dropdown.Item className="hover:bg-custom">
                <Link
                      to="/Suscripciones"

                    >
                      Suscripciones
                    </Link>
                </Dropdown.Item>
               
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

export default NavbarAdmin;
