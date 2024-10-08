import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import { FaArrowLeft } from 'react-icons/fa';

const EditarVendedor = () => {
  const { userData } = useContext(UserContext);
  const [vendedor, setVendedor] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { idVendedor } = useParams();

  useEffect(() => {
    const fetchVendedor = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/vendedor/${idVendedor}`);
        setVendedor(response.data);
      } catch (error) {
        console.error('Error al obtener el vendedor:', error);
      }
    };

    fetchVendedor();
  }, [idVendedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendedor((prevVendedor) => ({
      ...prevVendedor,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const confirmUpdate = async () => {
    try {
      await Axios.put(`http://localhost:3001/vendedor/${idVendedor}`, vendedor);
      alert('Datos guardados exitosamente');
      navigate(`/perfil-vendedor`);
    } catch (error) {
      console.error('Error al actualizar el vendedor:', error);
    }
  };

  const cancelUpdate = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-28 px-10 relative">
        <Link 
            to="/perfil-vendedor" 
            className="absolute top-32 left-5 bg-custom hover:bg-custom-dark text-black font-bold p-3 rounded-full shadow-lg z-10"
            aria-label="Volver a perfil">
            <FaArrowLeft size={24} />
        </Link>
        <h1 className="text-5xl font-bold mb-6 text-center text-blue-600">Editar Vendedor</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-700">Nombre de la Empresa</label>
              <input
                type="text"
                name="nom_empresa"
                value={vendedor.nom_empresa || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={vendedor.telefono || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={vendedor.direccion || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Código Postal</label>
              <input
                type="number"
                name="codigo_postal"
                value={vendedor.codigo_postal || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">País</label>
              <input
                type="text"
                name="pais"
                value={vendedor.pais || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Estado</label>
              <input
                type="text"
                name="estado"
                value={vendedor.estado || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">RFC</label>
              <input
                type="text"
                name="rfc"
                value={vendedor.rfc || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Guardar Cambios
          </button>
        </form>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-lg font-bold">Confirmar Cambios</h2>
              <p>¿Estás seguro de que deseas guardar los cambios?</p>
              <div className="mt-4">
                <button
                  onClick={confirmUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Sí
                </button>
                <button
                  onClick={cancelUpdate}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarVendedor;
