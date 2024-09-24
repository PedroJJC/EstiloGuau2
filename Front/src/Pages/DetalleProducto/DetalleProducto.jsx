import React, {  useEffect, useState, useContext  } from 'react';
import Navbar from "../../Components/Navbar/Navbar";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserContext } from '../../Context/UserContext';
import { Link } from 'react-router-dom';


const DetalleProducto = () => {
  const { userData } = useContext(UserContext);

  const { idProducto } = useParams(); // Extraer el ID del producto desde la URL
  const [producto, setProducto] = useState({
    sku: '',
    Marca: '',
    precio: '',
    idTalla: '',
    descripcion: '',
    foto: ''
  });
  const [tallas, setTallas] = useState([]); // Estado para las tallas disponibles
  const [selectedSize, setSelectedSize] = useState(''); // Estado para la talla seleccionada
  const [message, setMessage] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [selectedCantidad, setSelectedCantidad] = useState(1);
  const [productosNoComprados, setProductosNoComprados] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setCurrentImage(response.data.foto); // Establecer la URL de la imagen actual
        setSelectedSize(response.data.idTalla); // Establecer la talla actual del producto
      } catch (error) {
        console.error(`Error al obtener el producto con ID ${idProducto}:`, error);
        setMessage('Error al obtener el producto.');
      }
    };

    // Función para obtener las tallas disponibles desde la API
    const obtenerTallas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tallas');
        setTallas(response.data);
      } catch (error) {
        console.error('Error al obtener las tallas:', error);
      }
    };

    // Llamar a las funciones para obtener los datos
    obtenerProducto();
    obtenerTallas();
  }, [idProducto]);

  useEffect(() => {
    if (userData.idUsuario) {
      obtenerProductosNoComprados();
    }
  }, [userData.idUsuario]);

  const obtenerProductosNoComprados = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/no-comprado/${userData.idUsuario}`);
      setProductosNoComprados(response.data);
      setLoading(false); // Finaliza la carga cuando se obtienen los datos
    } catch (error) {
      console.error('Error al obtener los productos no comprados:', error);
      setLoading(false); // Finaliza la carga en caso de error
    }
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value); // Actualiza la talla seleccionada
  };

  const handleChange = (e) => {
    setCantidad(Number(e.target.value));
  };

  if (message) {
    return <div>{message}</div>;
  }

  if (!producto || !producto.foto) {
    return <div>Cargando...</div>;
  }

  const handleAddToCart = async () => {
    try {
      const response = await axios.post('http://localhost:3001/nueva-compra', {
        idUsuario: userData.idUsuario,
        idProducto: idProducto,
        cantidad_producto: cantidad // Aquí usamos la variable 'cantidad' que tiene el valor seleccionado
      });
      console.log('Respuesta del servidor:', response.data);
      showAlert(); // Mostrar la alerta de compra exitosa
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al realizar la compra. Por favor, intenta de nuevo más tarde.'
      });
    }
  };

  const showAlert = () => {
    const precio = producto.precio;
    const total = precio * cantidad; 
    Swal.fire({
      title: '¡Gracias por tu compra!',
      html: `
   <div style="text-align: left; font-family: 'Roboto', sans-serif; color: #333;">
  <p style="text-align: center"><strong>Resumen de tu compra:</strong></p>
    <p>Nombre producto:  ${ producto.producto}</p>
    <p>Precio: $${producto.precio}</p>
    <p>Cantidad: ${cantidad}</p>
    <p>Total: $${total}</p>
</div>
      `,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  };


  return(
    <div className="flex flex-col p-4 pt-28 items-center justify-center">
        
        <div className="flex flex-row items-center w-full rounded shadow p-4 justify-center">
        <Navbar/>
        <div className="flex flex-col">
        {/**<img src={PerritoCapucha} alt="Product" className="w-28 h-28 m-5" />
        <img src={PerritoCapucha} alt="Product" className="w-28 h-28 m-5" />
        <img src={PerritoCapucha} alt="Product" className="w-28 h-28 m-5" />*/}
      </div>
      <div className="ml-10">
      <img src={`http://localhost:3001/images/${producto.foto}`}  alt="Selected Dog Outfit" className="w-96 h-96 rounded" />
      </div>
      <div className="ml-20 max-w-md font-roboto ">
        <h2 className="font-roboto text-4xl font-bold text-start">{producto.descripcion}</h2>
        <p className="text-gray-700 my-6 text-start  text-sm font-light">¡Tu mejor amigo merece lo mejor! Nuestro conjunto perrito con suéter es perfecto para mantener a tu mascota abrigada y con estilo durante los días fríos.</p>
        <div className="size-selector my-4 text-start">
          <label className="font-roboto text-start" htmlFor="size">Seleccione la talla </label>

          <select
        className="font-roboto"
        id="size"
        name="size"
        value={selectedSize} // Asegúrate de que el valor seleccionado está en el estado
        onChange={handleSizeChange} // Maneja el cambio de talla
      > 
      {tallas.map(talla => (
        <option className="font-roboto" key={talla.idTalla} value={talla.idTalla}>
          {talla.talla}
        </option>
        ))}
      </select>
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
        <p className="font-roboto text-start text-sm old-price line-through text-red-500">$1200.99</p>
        <p className="font-roboto text-start text-2xl new-price text-green-500 my-4">${producto.precio}</p>
        
        <div className="flex items-start">
          <button
              onClick={handleAddToCart}
              className="mr-6 add-to-cart font-roboto font-bold bg-custom text-black p-3 mt-4 hover:bg-second"
            >
              Comprar
            </button>

        <button
              onClick={handleAddToCart}
              className="add-to-cart font-roboto font-bold bg-custom text-black p-3 mt-4 hover:bg-second"
            >
              Agregar al carrito
            </button>

        </div>
        
      </div>
    </div>

    <div className="w-full max-w-4xl mt-8 items-center">
        <h3 className="font-roboto text-4xl font-bold mb-5">Últimas tendencias</h3>
        <div className="flex overflow-x-scroll">
        {productosNoComprados.length > 0 ? (
            productosNoComprados.map(producto => (
              <Link key={producto.idProducto} to={`/detalleproducto/${producto.idProducto}`}>
                <div className="flex flex-col items-center w-30 h-auto mr-8">
                  <img src={`http://localhost:3001/images/${producto.foto}`} alt="Trend Item" className="w-44 h-auto rounded" />
                  <p className="text-center mt-2">${producto.precio.toFixed(2)}</p>
                  <p className="text-center font-semibold ">{producto.descripcion}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No hay productos no comprados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default DetalleProducto;