import React, {  useEffect, useState, useContext  } from 'react';
import Navbar from "../../Components/Navbar/Navbar";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa'; // Asegúrate de importar el ícono que desees
import Swal from 'sweetalert2';
import { UserContext } from '../../Context/UserContext';
import { Link } from 'react-router-dom';

const DetalleProducto = () => {
  const [producto, setProducto] = useState({
    sku: '',
    Marca: '',
    precio: '',
    idTalla: '',
    descripcion: '',
    foto: ''
  });
  const { idProducto } = useParams();
  const fotos = producto.foto.split(",");
  // Estado para la imagen seleccionada
  const [selectedImage, setSelectedImage] = useState(fotos[1]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();



  useEffect(() => {
    // Verifica que el ID del producto es válido
    if (!idProducto) {
      setMessage('ID del producto no proporcionado.');
      return;
    }
  
    // Función para obtener el producto desde la API
    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/productos/${idProducto}`);
        setProducto(response.data);
        const fotos = response.data.foto.split(','); // Obtener las fotos del producto
  
        // Establecer la imagen actual y la seleccionada
        setCurrentImage(fotos);
        setSelectedImage(fotos[0]); // Asegura que la primera foto sea la seleccionada al cargar
        setCargando(false);
      } catch (error) {
        console.error(`Error al obtener el producto con ID ${idProducto}:`, error);
        setError('Error al obtener el producto.');
        setCargando(false);
      }
    };
  
    obtenerProducto(); // Llama a la función para obtener el producto
  
  }, [idProducto]);

  
  const handleChange = (e) => {
    setCantidad(Number(e.target.value));
  };

  if (cargando) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  const handleImageClick = (foto) => {
    setSelectedImage(foto); // Cambia la imagen seleccionada al hacer clic
  };

  return(
    <div className="flex flex-col p-4 pt-24 ">
         <Navbar/>
         <div className="flex justify-start">
  <div
    onClick={() => navigate(-1)}
    className="flex items-center  cursor-pointer text-slate-500 hover:text-custom font-bold mt-5 text-3xl"
  >
    <FaArrowLeft className="mr-2" />
    <span></span>
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
            className="w-28 h-28 m-5 cursor-pointer" // Agrega un cursor de puntero para indicar que es clickeable
            onClick={() => handleImageClick(foto)} // Manejar el clic en la imagen
          />
        ))}
      </div>
      <div className="ml-10">
        <img
          src={`http://localhost:3001/images/${selectedImage}`} // Usar la imagen seleccionada
          alt="Selected Dog Outfit"
          className="w-96 h-96 rounded"
        />
      </div>
    </div>
      <div className="ml-20 max-w-md font-roboto ">
        <h2 className="font-roboto text-4xl font-bold text-start">{producto.producto}</h2>
        <p className="text-gray-700 my-6 text-start  text-sm font-light">{producto.descripcion}</p>
        <div className="size-selector my-4 text-start">
          <label className="font-roboto text-start" htmlFor="size">Seleccione la talla </label>          
      <div className='items-start my-5'>
        <label htmlFor=""> Unidades </label>
        <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              min="1"
              className="font-roboto w-20 h-8"
            /> 
        </div>

        </div>
        {/*<p className="font-roboto text-start text-sm old-price line-through text-red-500">$1200.99</p>*/}
        <p className="font-roboto text-start text-2xl new-price text-green-500 my-4">${producto.precio}</p>
        
        <div className="flex items-start">
          <button
              
              className="mr-6 add-to-cart font-roboto font-bold bg-custom text-black p-3 mt-4 hover:bg-second"
            >
              Comprar
            </button>

        
        <button             
              className="add-to-cart font-roboto font-bold bg-custom text-black p-3 mt-4 hover:bg-second"
            >
              Agregar al carrito
            </button>

        </div>
        
      </div>
    </div>
    </div>
  );
}
export default DetalleProducto;
