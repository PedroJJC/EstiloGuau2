import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../Context/CartContext';
import Navbar from '../../Components/Navbar/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa'; 
import { UserContext } from '../../Context/UserContext';

const DetalleProducto = () => {
  const {agregarAlCarrito} = useContext(CartContext);
  const [producto, setProducto] = useState({
    sku: '',
    Marca: '',
    precio: Float32Array,
    idTalla: '',
    descripcion: '',
    foto: '',
    porcentaje_descuento: Float32Array,
    precioConDescuento: Float32Array
  });

  const { idProducto } = useParams();
  const fotos = producto.foto.split(",");

  const [selectedImage, setSelectedImage] = useState(fotos[1]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [valoracion, setValoracion] = useState(0);

  const navigate = useNavigate();
  const { userData } = useContext(UserContext); 
  const { idUsuario } = userData;

  useEffect(() => {
    if (!idProducto) {
      setError('ID del producto no proporcionado.');
      return;
    }

    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/productos/${idProducto}`);
        const producto = response.data;

    // Suponiendo que el producto tiene un campo `precio` y `porcentaje_descuento`
      if (producto.porcentaje_descuento != 0) {
        const descuento = (producto.precio * producto.porcentaje_descuento) / 100;
        const precioConDescuento = producto.precio - descuento;
        producto.precioConDescuento = precioConDescuento;
      } else {
        // Si el porcentaje de descuento es 0, el precio con descuento es 0
        producto.precioConDescuento = 0;
      }
        setProducto(producto);
        setSelectedImage(response.data.foto.split(',')[0]); 
        setCargando(false);
      } catch (error) {
        console.error(`Error al obtener el producto con ID ${idProducto}:`, error);
        setError('Error al obtener el producto.');
        setCargando(false);
      }
    };
    obtenerProducto();
    fetchComentarios();
  }, [idProducto]);

  const fetchComentarios = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/comentarios/${idProducto}`);
      setComentarios(response.data);
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    }
  };

  const calcularPorcentaje = (estrellas) => {
    const totalComentarios = comentarios.length;
    const cantidadComentarios = comentarios.filter(c => c.valoracion === estrellas).length;
    return totalComentarios > 0 ? ((cantidadComentarios / totalComentarios) * 100).toFixed(2) : 0;
  };

  //para mostrar comentarios
  const [comentariosMostrados, setComentariosMostrados] = useState(5);

  const handleMostrarMas = () => {
    setComentariosMostrados(prev => Math.min(prev + 5, comentarios.length));
  };

  const handleMostrarMenos = () => {
    setComentariosMostrados(prev => Math.max(prev - 5, 5)); // Regresa a 5 si ya está en 5
  };

  const handleChange = (e) => {
    setCantidad(Number(e.target.value));
  };

  const handleImageClick = (foto) => {
    setSelectedImage(foto); 
  };

  const handleAgregarComentario = async () => {
    if (!idUsuario) {
      console.error('ID de usuario no disponible');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3001/comentarios', {
        idUsuario,
        idProducto,
        comentario,
        valoracion
      });

      const nuevoComentario = { ...response.data, nombre: userData.nombre, email: userData.email };
      setComentarios(prevComentarios => [...prevComentarios, nuevoComentario]);
      setComentario('');
      setValoracion(0); 
      setShowModal(false); 

      // Actualizar comentarios después de agregar uno nuevo
      fetchComentarios();

    } catch (error) {
      console.error('Error al agregar comentario:', error);
      alert('Error al agregar comentario: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (cargando) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col p-4 pt-24">
      <Navbar />
      <div className="flex justify-start">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center cursor-pointer text-slate-500 hover:text-custom font-bold mt-5 text-3xl"
        >
          <FaArrowLeft className="mr-2" />
          <span>Volver</span>
        </div>
      </div>
      
      <div className="flex flex-row items-center w-full rounded shadow p-4 justify-center">
        <div className="flex">
          <div className="flex flex-col">
            {fotos.map((foto, index) => (
              <img
                key={index}
                src={`http://localhost:3001/images/${foto}`}
                alt={`Product ${index + 1}`}
                className="w-28 h-28 m-5 cursor-pointer"
                onClick={() => handleImageClick(foto)}
              />
            ))}
          </div>
          <div className="ml-10">
            <img
              src={`http://localhost:3001/images/${selectedImage}`}
              alt="Selected"
              className="w-96 h-96 rounded"
            />
          </div>
        </div>
        <div className="ml-20 max-w-md font-roboto">
          <h2 className="font-roboto text-4xl font-bold text-start">{producto.producto}</h2>
          <p className="text-gray-700 my-6 text-start text-sm font-light">{producto.descripcion}</p>
          <div className="size-selector my-4 text-start">
            <label className="font-roboto text-start" htmlFor="size">Seleccione la talla </label>
            <div className='items-start my-5'>
              <label htmlFor=""> Unidades </label>
              <input
                type="number"
                value={cantidad}
                onChange={handleChange}
                min="1"
                className="font-roboto w-20 h-8"
              />
            </div>
          </div>
          <p className="font-roboto text-start text-2xl new-price text-green-500 my-4">${producto.precioConDescuento != 0 ? producto.precioConDescuento.toFixed(2) : producto.precio.toFixed(2)}</p>
          <div className="flex items-start">
            <button className="mr-6 add-to-cart font-roboto font-bold bg-custom text-black p-3 mt-4 hover:bg-second">
              Comprar
            </button>
            <button className="add-to-cart font-roboto font-bold bg-custom text-black p-3 mt-4 hover:bg-second" onClick={() => agregarAlCarrito (producto)}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
  
      {/* Sección de Opiniones de Clientes */}
      <div className="flex mt-8">
        {/* Sección de Opiniones */}
        <div className="calificacion w-1/3 p-4 border rounded h-auto">
          <h3 className="text-xl font-bold">Opiniones de Clientes</h3>
          {[5, 4, 3, 2, 1].map((estrellas) => {
            const porcentaje = calcularPorcentaje(estrellas);
            return (
              <div key={estrellas} className="flex items-center my-2">
                <span className="mr-2">{estrellas} estrellas</span>
                <div className="w-full bg-gray-300 rounded h-2 relative">
                  <div
                    className="bg-yellow-500 h-full rounded"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
                <span className="ml-2">{porcentaje}%</span>
              </div>
            );
          })}
        </div>
  
        {/* Espacio entre Calificación y Comentarios */}
        <div className="w-4" />
  
        {/* Sección de Comentarios */}
        <div className="comentarios w-2/3 p-4 border rounded max-w-lg">
          <h3 className="text-xl font-bold">Comentarios</h3>
          {comentarios.slice(0, comentariosMostrados).map(c => (
            <div key={c.idComentario} className="comentario mt-4 p-2 border rounded">
              <p><strong>{c.nombre} ({c.email})</strong>: {c.comentario}</p>
              <p className="text-sm text-gray-500">{new Date(c.fecha).toLocaleString()} - Valoración: {c.valoracion}</p>
            </div>
          ))}

          <div className="mt-2">
            {comentariosMostrados < comentarios.length && (
              <span
                onClick={handleMostrarMas}
                className="text-blue-500 text-sm cursor-pointer hover:underline"
              >
                Ver más..
              </span>
            )}
            
            {comentariosMostrados > 5 && (
              <span
                onClick={handleMostrarMenos}
                className="text-blue-500 text-sm cursor-pointer hover:underline ml-2"
              >
                Ver menos..
              </span>
            )}
          </div>
          <div className="add-comentario mt-4">
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
              className="w-full p-2 border rounded"
            />
            <button 
              onClick={openModal}
              className="bg-blue-500 text-white p-2 rounded mt-2"
              disabled={!comentario.trim()} 
            >
              Agregar Comentario
            </button>
          </div>
        </div>
      </div>
  
      {/* Modal para seleccionar valoración */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Selecciona tu Valoración</h3>
            <div className="flex my-4">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`cursor-pointer text-2xl ${valoracion > index ? 'text-yellow-500' : 'text-gray-400'}`}
                  onClick={() => setValoracion(index + 1)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white p-2 rounded" onClick={handleAgregarComentario}>
                Confirmar Comentario
              </button>
              <button className="ml-2 p-2 border rounded" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleProducto;
