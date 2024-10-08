import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Navbar from "../../Components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { FiEdit } from "react-icons/fi";
import { FaArrowRight } from 'react-icons/fa'; // Importa el icono de flecha

const PerfilUsuario = () => {
  const { userData } = useContext(UserContext);
  const [usuario, setUsuario] = useState(null);
  const [compras, setCompras] = useState([]);
  const [suscripcionesActivas, setSuscripcionesActivas] = useState(0);
  const [puntosFidelidad, setPuntosFidelidad] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/usuarioget/${userData.idUsuario}`);
        setUsuario(response.data);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUsuario();
  }, [userData.idUsuario]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/comprasxus/${userData.idUsuario}`);
        setCompras(response.data);
      } catch (error) {
        console.error('Error al obtener las compras:', error);
      }
    };

    fetchCompras();
  }, [userData.idUsuario]);

  useEffect(() => {
    const fetchSuscripcionesActivas = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/suscripciones-activas/${userData.idUsuario}`);
        setSuscripcionesActivas(response.data.totalSuscripciones);
      } catch (error) {
        console.error('Error al obtener suscripciones activas:', error);
      }
    };

    const fetchPuntosFidelidad = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/puntos-fidelidad/${userData.idUsuario}`);
        setPuntosFidelidad(response.data.totalPuntos);
      } catch (error) {
        console.error('Error al obtener puntos de fidelidad:', error);
      }
    };

    fetchPuntosFidelidad();
    fetchSuscripcionesActivas();
  }, [userData.idUsuario]);

  if (!usuario) {
    return <div className="min-h-screen flex items-center justify-center font-roboto">Cargando perfil...</div>;
  }

  const comprasRecientes = compras.slice(0, 3);

  const handleOpenModal = (producto) => {
    setSelectedProduct(producto);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-28 px-10">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg mb-8">
          <h1 className="text-5xl font-bold text-white text-center">Bienvenido, {usuario.nombre}!</h1>
        </div>
  
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
          <img src={`http://localhost:3001/images/${usuario.foto}`} alt="Usuario" className="rounded-full h-40 w-40 object-cover mr-6" />
          <div className="flex-grow">
            <h2 className="text-3xl font-bold">{usuario.nombre} {usuario.apellido}</h2>
            <p className="text-lg">Email: {usuario.email}</p>
            <p className="text-lg">Contraseña: {'*'.repeat(usuario.password.length)}</p>
          </div>
          <Link to={`/formUs`} className="ml-4">
            <FiEdit className="h-10 w-10 text-black hover:text-custom cursor-pointer" />
          </Link>
        </div>
  
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Compras Realizadas</h3>
            <p className="text-3xl">{compras.length}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Suscripciones Activas</h3>
            <p className="text-3xl">{suscripcionesActivas}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold">Tus Puntos por Compras</h3>
            <p className="text-3xl">{puntosFidelidad}</p>
          </div>
        </div>
  
        <h2 className="text-5xl font-semibold mb-4">Últimas Compras</h2>
        <div 
          className="relative"
          onMouseEnter={() => setShowButton(true)}
          onMouseLeave={() => setShowButton(false)}
        >
          {comprasRecientes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comprasRecientes.map(compra => (
                <div key={compra.idCompra} className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
                  <img src={`http://localhost:3001/images/${compra.foto}`} className="h-24 w-24 rounded-full mb-4 mx-auto" alt="Producto" />
                  <h3 className="font-bold">{compra.descripcion_producto}</h3>
                  <p>Precio: ${compra.precio}</p>
                  <p>Talla: {compra.talla}</p>
                  <button 
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" 
                    onClick={() => handleOpenModal(compra)}
                  >
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No has realizado compras aún.</p>
          )}

          {compras.length > 3 && showButton && (
            <Link to="/ver-todas-compras" className="absolute bottom-32 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
              <span className="flex items-center justify-center">
                <span>Ver tus compras</span>
                <FaArrowRight className="ml-2" /> {/* Icono de flecha a la derecha */}
              </span>
            </Link>
          )}
        </div>

        {/* Modal para detalles del producto */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-1/2">
              <h2 className="text-2xl font-bold mb-4">{selectedProduct?.producto}</h2>
              <img src={`http://localhost:3001/images/${selectedProduct?.foto}`} alt={selectedProduct?.producto} className="w-full h-48 object-cover mb-4" />
              <p className="text-lg"><strong>Descripción:</strong> {selectedProduct?.descripcion}</p>
              <p className="text-lg"><strong>Precio:</strong> ${selectedProduct?.precio}</p>
              <p className="text-lg"><strong>Talla:</strong> {selectedProduct?.talla}</p>
              <p className="text-lg"><strong>Cantidad:</strong> {selectedProduct?.cantidad_producto}</p>
              <p className="text-lg"><strong>Marca:</strong> {selectedProduct?.Marca}</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleCloseModal}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );  
};

export default PerfilUsuario;
