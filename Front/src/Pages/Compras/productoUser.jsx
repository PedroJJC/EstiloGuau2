import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Navbar from "../../Components/Navbar/Navbar";
import { UserContext } from '../../Context/UserContext';
import { Link } from 'react-router-dom';
import Footer from "../../Components/Footer/Footer";
import { FaArrowLeft } from 'react-icons/fa';

const ProductoUser = () => {
  const { userData } = useContext(UserContext);
  const [compras, setCompras] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/todas-compras/${userData.idUsuario}`);
        setCompras(response.data);
      } catch (error) {
        console.error('Error al obtener todas las compras:', error);
      }
    };

    fetchCompras();
  }, [userData.idUsuario]);

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
        {/* Botón de volver al perfil sin texto */}
        <Link to="/PerfilUsuario" className="flex items-center text-slate-500 hover:text-custom mb-4">
          <FaArrowLeft className="text-3xl" />
        </Link>
        
        <h2 className="text-5xl font-semibold mb-4">Todas tus Compras</h2>
        {compras.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compras.map(compra => (
              <div key={compra.idCompra} className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
                <img src={`http://localhost:3001/images/${compra.foto}`} className="h-24 w-24 rounded-full mb-4 mx-auto" alt="Producto" />
                <h3 className="font-bold">{compra.descripcion_producto}</h3>
                <p>Precio: ${compra.precio}</p>
                <p>Talla: {compra.talla}</p>
                <p>Cantidad: {compra.cantidad_producto}</p>
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
      <Footer/>
    </div>
  );
};

export default ProductoUser;
