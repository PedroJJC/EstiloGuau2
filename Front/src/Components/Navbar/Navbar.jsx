import React, { useContext, useState } from "react";
import { UserContext } from '../../Context/UserContext';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import './Navbar.css';
import { Dropdown, Navbar, Tabs  } from "flowbite-react";
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import Logo from "../../img/Logo.png";

const Component = () => {
  const { userData, logout } = useContext(UserContext);
  const { idUsuario, idRol } = userData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/"; 
    const handleLogout = () => {
    logout();
  };

  // Función para cerrar el menú móvil al navegar
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Navbar fluid rounded className={`fixed w-full z-20 top-0 start-0 border-b p-4 shadow-md ${isLandingPage ? "bg-black border-gray-700" : "bg-white border-gray-200"}`}>
      {/* Contenedor principal */}
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Navbar.Brand>
          <Link to="/">
            <img className="h-20 w-auto" src={Logo} alt="Logo" />
          </Link>
        </Navbar.Brand>

       
        

        {/* Título "ESTILO GUAU" */}
        <div className="hidden md:block text-center">
          <div className={`text-5xl font-semibold tracking-widest font-roboto ${isLandingPage ? "text-white" : "text-black"}`}>
            ESTILO GUAU
          </div>
        </div>

        {/* Botones visibles en pantallas medianas y mayores */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Botón de carrito */}
          <button onClick={() => setIsCartOpen(true)} className={`h-9 w-9 ${isLandingPage ? "bg-black" : ""}`} aria-hidden="true">
            <ShoppingCartIcon className={`h-9 w-9 ${isLandingPage ? "text-white" : "text-red-500"}`} aria-hidden="true" />
          </button>
          <ShoppingCart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

          {/* Enlace a la tienda */}
          <Link to="/Tienda">
            <button className={`h-9 w-9 ${isLandingPage ? "bg-black" : ""}`} aria-hidden="true">
              <span className="sr-only">Tienda</span>
              <ShoppingBagIcon className={`h-9 w-9 ${isLandingPage ? "text-white" : "text-red-500"}`} aria-hidden="true" />
            </button>
          </Link>
          

          {/* Dropdown del usuario */}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Bars3Icon className={`h-9 w-9 ${isLandingPage ? "text-white" : "text-red-500"}`} aria-hidden="true" strokeWidth={3} />
            }
          >
            {idUsuario ? (
              <Dropdown.Header>
                <span className="block text-sm text-center font-semibold">¡Bienvenido (a)!</span>
                <span className="block text-sm text-center font-normal">{userData.nombre || "Nombre no disponible"}</span>
                <span className="block truncate text-sm font-light text-center">{userData.email || "Email no disponible"}</span>
              </Dropdown.Header>
            ) : (
              <Dropdown.Header>
                <span className="block text-sm">¡Bienvenido (a)!</span>
              </Dropdown.Header>
            )}

            {/* Opciones del dropdown */}
            <Dropdown.Item>
              <Link to="/Suscripciones">Suscripciones</Link>
            </Dropdown.Item>

            {idUsuario && (
              <Dropdown.Item>
                <Link to="/PerfilUsuario">Mi perfil</Link>
              </Dropdown.Item>
            )}

            <Dropdown.Item>
              <Link to="/Uscupones">Mis cupones</Link>
            </Dropdown.Item>

            {(idRol === 2 || idRol === 3) && (
              <Dropdown.Item>
                <Link to="/dashboard">Dashboard</Link>
              </Dropdown.Item>
            )}

            <Dropdown.Divider />

            <Dropdown.Item>
              {idUsuario ? (
                <Link to="/" onClick={handleLogout}>Cerrar sesión</Link>
              ) : (
                <Link to="/Login">Iniciar sesión</Link>
              )}
            </Dropdown.Item>
          </Dropdown>
        </div>

       


        {/* Botón de menú para pantallas pequeñas */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
            {isMobileMenuOpen ? (
              <XMarkIcon className={`h-9 w-9 ${isLandingPage ? "text-white" : "text-red-500"}`} />
            ) : (
              <Bars3Icon className={`h-9 w-9 ${isLandingPage ? "text-white" : "text-red-500"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Dropdown móvil */}
      {isMobileMenuOpen && (
        
        <div className={`md:hidden bg-black/80 rounded shadow mt-2`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            
            {/* Información del usuario */}
            {idUsuario ? (
              <div>
                <div className="px-3 py-2">
                  <span className="block text-sm font-semibold text-center text-white">¡Hola!</span>
                  <span className="block text-sm text-center text-white">{userData.nombre || "Nombre no disponible"}</span>
                  <span className="block text-sm text-center text-white">{userData.email || "Email no disponible"}</span>
                </div>

                {/* Botón de carrito */}
                <button onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white bg-black/80 hover:bg-black/70 transition duration-300`}>
                  <ShoppingCartIcon className="h-6 w-6 mr-2" />
                  Carrito
                </button>

                {/* Enlace a la tienda */}
                <Link to="/Tienda" onClick={handleNavLinkClick} className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-black/80 hover:bg-black/70 transition duration-300`}>
                  <ShoppingBagIcon className="h-6 w-6 mr-2" />
                  Tienda
                </Link>

                {/* Suscripciones */}
                <Link to="/Suscripciones" onClick={handleNavLinkClick} className={`block px-3 py-2 rounded-md text-base font-medium text-white bg-black/80 hover:bg-black/70 transition duration-300`}>
                  Suscripciones
                </Link>

                {/* Mi perfil */}
                {idUsuario && (
                  <Link to="/PerfilUsuario" onClick={handleNavLinkClick} className={`block px-3 py-2 rounded-md text-base font-medium text-white bg-black/80 hover:bg-black/70 transition duration-300`}>
                    Mi perfil
                  </Link>
                )}

                {/* Dashboard */}
                {(idRol === 2 || idRol === 3) && (
                  <Link to="/dashboard" onClick={handleNavLinkClick} className={`block px-3 py-2 rounded-md text-base font-medium text-white bg-black/80 hover:bg-black/70 transition duration-300`}>
                    Dashboard
                  </Link>
                )}

                {/* Cerrar sesión */}
                <button onClick={() => { handleLogout(); handleNavLinkClick(); }} className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-black/80 hover:bg-black/70 transition duration-300`}>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link to="/Login" onClick={handleNavLinkClick} className={`block px-3 py-2 rounded-md text-base font-medium text-white bg-black/80 hover:bg-black/70 transition duration-300`}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}  
    </Navbar>
  );
};

export default Component;
