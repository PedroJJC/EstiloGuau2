import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { LocationContext  } from '../../Context/LocationContext';


const RegistroVendedor = () => {
  const { location, city, country } = useContext(LocationContext);
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom_empresa: '',
    direccion: location,
    telefono: '',
    pais: country,
    estado: city,
    codigo_postal: '',
    rfc: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const verificarEmpresa = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/empresa/verificar/${userData.idUsuario}`);
        if (response.data.existe) {
          alert(`Ya tienes una empresa asociada: ${response.data.vendedor.nom_empresa}`);
          navigate('/perfil-vendedor');
        }
      } catch (error) {
        console.error('Error al verificar la empresa:', error);
        setError('Error al verificar la empresa.');
      }
    };

    if (userData?.idUsuario) {
      verificarEmpresa();
    }
  }, [userData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtener ID de suscripción desde los parámetros de la URL
      const queryParams = new URLSearchParams(window.location.search);
      const subscriptionId = queryParams.get('subscriptionId');

      if (!subscriptionId) {
        setError('ID de suscripción no disponible.');
        return;
      }

      const idRol = userData.idRol; // Si el rol se debe obtener del contexto, asegúrate que sea el correcto

      // Registrar vendedor
      await axios.post('http://localhost:3001/registro-vendedor', {
        ...formData,
        idUsuario: userData.idUsuario,
        idRol,
        id_sub: subscriptionId, // Usar el ID de la suscripción de la URL
      });

      setSuccessMessage('Vendedor registrado con éxito.');
      setError('');
      navigate('/perfil-vendedor');
    } catch (error) {
      console.error('Error al registrar el vendedor:', error);
      setError('Error al registrar. Intenta de nuevo más tarde.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl mb-4 text-center">Registrar Vendedor</h2>
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          
          <div className="flex flex-col space-y-4">
            <input type="text" name="nom_empresa" placeholder="Nombre de la empresa" onChange={handleChange} required />
            <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
            <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
            <input type="text" name="pais" placeholder="País" onChange={handleChange} required />
            <input type="text" name="estado" placeholder="Estado" onChange={handleChange} required />
            <input type="text" name="codigo_postal" placeholder="Código Postal" onChange={handleChange} required />
            <input type="text" name="rfc" placeholder="RFC" onChange={handleChange} required />
          </div>

          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Registrar Vendedor</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegistroVendedor;
