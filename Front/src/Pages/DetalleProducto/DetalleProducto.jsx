import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../Context/CartContext';
import Navbar from '../../Components/Navbar/Navbar';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import Footer from "../../Components/Footer/Footer";
import { AiFillStar } from 'react-icons/ai';


const DetalleProducto = () => {
  const { agregarAlCarrito } = useContext(CartContext);
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
  const [tallas, setTallas] = useState([]);
  const { idProducto } = useParams();
  const fotos = producto.foto.split(",");
  const [idTalla, setIdTalla] = useState(null);

  const [selectedImage, setSelectedImage] = useState(fotos[1]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [productosPrecios, setProductosPrecios] = useState(null);
  const [productosOferta, setProductosOferta] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [valoracion, setValoracion] = useState(0);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const { userData } = useContext(UserContext);
  const { idUsuario } = userData;
  let precioSeleccionado = productosPrecios && productosOferta
  ? productosPrecios - (productosPrecios * productosOferta / 100)
  : productosPrecios || 0;
  let precioOriginal = productosPrecios;
  

  useEffect(() => {
    if (!idProducto) {
      setError('ID del producto no proporcionado.');
      return;
    }

    if (tallas.length > 0 && !tallaSeleccionada) {
      const primeraTalla = tallas[0].Talla;
      setTallaSeleccionada(primeraTalla);
      setIdTalla(primeraTalla);
    }

    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/productos/${idProducto}`);
        const producto = response.data;
        console.log(response.data);
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
  }, [idProducto, tallas, tallaSeleccionada]);

  const obtenerTallas = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/tallasxidproducto/${idProducto}`);
      console.log("hgfdscfghfdsgh", response.data)
      setTallas(response.data); // Guarda las tallas en el estado
      setCargando(false);
    } catch (error) {
      console.error(`Error al obtener las tallas para el producto con ID ${idProducto}:`, error);
      setError('Error al obtener las tallas.');
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerTallas();
  }, [idProducto]);

  const fetchComentarios = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/comentarios/${idProducto}`);
      setComentarios(response.data);
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    }
  };

  const fetchProductosPrecios = async () => {
    
    try {      
      const response = await axios.get(`http://localhost:3001/productosprecios/${idProducto}/${idTalla}`);
      console.log("dentro");
      console.log(response.data)
      setProductosPrecios(response.data.precio); // Actualiza el estado con los precios
      setProductosOferta(response.data.Oferta); // Actualiza el estado con los precios
    } catch (error) {
      console.error('Error al obtener los precios:', error);
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
  // Funciones para aumentar y disminuir la cantidad
  const incrementarCantidad = () => setCantidad(prevCantidad => prevCantidad + 1);
  const decrementarCantidad = () => {
    if (cantidad > 1) setCantidad(prevCantidad => prevCantidad - 1);
  };

  const handleChange = (e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    if (!isNaN(nuevaCantidad) && nuevaCantidad >= 1) {
      setCantidad(Number(e.target.value));
      console.log(e.target.value);
    }

  };
  const handleTallaClick = (talla) => {
    setTallaSeleccionada(talla); // Actualiza la talla seleccionada
    setIdTalla(talla); 
    
  };

  useEffect(() => {
    if (idProducto && idTalla) {
      fetchProductosPrecios(); // Llama a la API para obtener los precios
    }
  }, [idProducto, idTalla]);

 

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
    <div className="flex flex-col pt-36 w-full h-screen">
      <Navbar />
      <div className="flex justify-start">
        {/*<div
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer text-slate-500 hover:text-custom font-bold mt-5 text-3xl"
      >
        <FaArrowLeft className="mr-2" />
        <span>Volver</span>
      </div>*/}
      </div>

      <div className="flex flex-row items-center w-full justify-center">
        <div className="flex">
          <div className="flex flex-col">
            {fotos.map((foto, index) => (
              <img
                key={index}
                src={`http://localhost:3001/images/${foto}`}
                alt={`Product ${index + 1}`}
                className="w-32 h-auto m-2 cursor-pointer"
                onClick={() => handleImageClick(foto)}
              />
            ))}
          </div>
          <div className="ml-20">
            <img
              src={`http://localhost:3001/images/${selectedImage}`}
              alt="Selected"
              className="w-auto h-96 rounded"
            />
          </div>
        </div>
        <div className="ml-20 max-w-md font-roboto">
          <h2 className="font-roboto text-5xl font-bold text-start">{producto.producto}</h2>
          <p className="text-gray-700 my-6 text-start text-2xl font-extralight">{producto.descripcion}</p>
          <div className="size-selector my-4 text-start">
            <label className="font-roboto text-start mb-2 font-medium text-base">Seleccione la talla:</label>
            <div>
      {/* Botones para seleccionar la talla */}
      <div className="flex flex-wrap gap-2 mb-4 m-2">
        {tallas.map((talla, index) => (
          <button
            key={index}
            onClick={() => handleTallaClick(talla.Talla)} // Llama a handleTallaClick al hacer clic
            className={`border p-2 rounded-full ${tallaSeleccionada === talla.Talla ? 'bg-custom text-black border-black' : 'border-black'}`}
          >
            {talla.Talla}
          </button>
        ))}
      </div>
            </div>


            <div className="flex flex-col">
              <label className="font-roboto text-start mb-2 font-medium text-base" htmlFor="unidades">Unidades:</label>
              <div className="flex flex-wrap gap-2 mb-4">
              {/* Botón de disminuir */}
              <button
                onClick={decrementarCantidad}
                className="px-2  bg-gray-300 rounded-l hover:bg-gray-400 font-extrabold text-4xl"
              >
                -
              </button>

              <div className="text-center items-center">
                <input
                  type="number"
                  id="unidades"
                  value={cantidad}
                  onChange={handleChange}
                  min="1"
                  className="font-roboto h-9 w-16 text-center text-xs px-0 flex justify-center items-center"
                />
              </div>


              {/* Botón de aumentar */}
              <button
                onClick={incrementarCantidad}
                className="px-2  bg-gray-300 rounded-r hover:bg-gray-400 font-normal text-3xl"
              >
                +
              </button>
              </div>
            </div>
          </div>
          <p className="font-bold text-left">
          {/* Mostrar los precios obtenidos */}
      {productosPrecios && productosOferta ? (
        <p className="font-roboto text-start text-2xl new-price text-red-600 my-6">
         <p className='line-through'>${productosPrecios} </p>
         <p className='font-roboto text-start text-3xl new-price text-green-500 my-6' >
          ${precioSeleccionado}</p>
          
        </p>
      ) : (
        productosPrecios  ? (
          <p className="font-roboto text-start text-3xl new-price text-green-500 my-6">
            ${precioSeleccionado}
          </p>
        ) : (
          <p>Seleccione una talla</p>
        )
      )}
  </p>
          <div className="flex items-start">

        <Link  to={"/resumencompra"}>
          <button
            className={`mr-6 add-to-cart font-roboto font-bold bg-custom text-black p-3 mt-4 hover:bg-second `}          
          
            onClick={() => agregarAlCarrito(producto,tallaSeleccionada, cantidad, precioSeleccionado,precioOriginal, productosOferta)}>
            Comprar
          </button>
        </Link>
       
            <button 
            className="add-to-cart font-roboto font-bold bg-custom text-black p-3 mt-4 hover:bg-second" 
            onClick={() => agregarAlCarrito(producto,tallaSeleccionada, cantidad, precioSeleccionado,precioOriginal, productosOferta)}>
              
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      <div className="flex mt-20 justify-center">
  {/* Sección de Opiniones de Clientes */}
  <div className="calificacion w-1/4 p-4 h-auto">
    <h3 className="text-xl font-bold">Opiniones de Clientes</h3>
    {[5, 4, 3, 2, 1].map((estrellas) => {
      const porcentaje = calcularPorcentaje(estrellas);
      return (
        <div key={estrellas} className="flex items-center my-2">
          <div className="mr-2 flex">
            {[...Array(estrellas)].map((_, index) => (
              <AiFillStar key={index} className="text-yellow-500" />
            ))}
          </div>
          <div className="w-full bg-gray-300 rounded h-2 relative">
            <div
              className="bg-yellow-500 h-full rounded"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <span className="ml-2">{Math.floor(porcentaje)}%</span>
        </div>
      );
    })}
  </div>

  {/* Espacio entre Calificación y Comentarios */}
  <div className="w-10" />

  {/* Sección de Comentarios */}
  <div className="comentarios w-1/2 rounded">
    <h3 className="text-xl font-bold">Comentarios</h3>
    {comentarios.slice(0, comentariosMostrados).map(c => (
      <div key={c.idComentario} className="comentario mt-4 p-2 border-b border-x rounded">
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
        className="bg-custom text-black p-3 rounded mt-2"
        disabled={!comentario.trim()}
      >
        Agregar
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
              <button className="bg-custom text-black p-2 rounded" onClick={handleAgregarComentario}>
                Confirmar
              </button>
              <button className="ml-2 p-2 border rounded bg-red-500 text-white" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="">
        <Footer />
      </div>
    </div>

  );
};

export default DetalleProducto;
