import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import FooterAdmin from "../../Components/Footer/FooterAdmin";
import Sidebar from '../../Components/Sidebar/Sidebar';


const EditarProducto = () => {


  const { id } = useParams(); // Extraer el ID del producto desde la URL
  const [agregado, setAgregado] = useState(false);
  const [message, setMessage] = useState(''); // Estado para mensajes de éxito/error
  const [currentImage, setCurrentImage] = useState([]); // Estado para almacenar la URL de la imagen actual
  const [ofertas, setofertas] = useState([]);
  const [tallas, settallas] = useState([]);
  const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory
  const obtenerImagenUrl = (foto) => `http://localhost:3001/images/${foto}`;

  useEffect(() => {
    
  

    const obtenerOfertas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/all-ofertas');
        setofertas(response.data);
        //console.log(response.data)
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };
    const obtenerTallas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tallas');
        settallas(response.data);
        //console.log(response.data)
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };
    obtenerOfertas();
    obtenerTallas();

    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/productos/${id}`);
        setProducto(response.data);
        const fotos = response.data.foto.split(',');
        //console.log(response.data.foto)
        console.log(fotos)
        setCurrentImage(fotos); // Establecer la URL de la imagen actual
      } catch (error) {
        console.error(`Error al obtener el producto con ID ${id}:`, error);
      }
    };

    obtenerProducto(); 
    const today = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    setProducto((prevProducto) => ({
      ...prevProducto,
      fecha_ingreso: today
    }));
    console.log(today)
  }, [id]);
  
  const [producto, setProducto] = useState({
    sku: '',
    producto: '',
    Marca: '',
    precio: '',
    idTalla: '',
    descripcion: '',
    foto: [],
    idOferta:'',
    fecha_ingreso : ''
    });

/*   const obtenerProducto = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/productos/${id}`);
      setProducto(response.data);
      setCurrentImage(response.data.foto); // Establecer la URL de la imagen actual
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error);
    }
  }; */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files;
    console.log('file')
    // Verificar si se seleccionaron más de 4 archivos
    if (file.length > 4) {
      alert("Solo puedes seleccionar un máximo de 4 imágenes.");
      e.target.value = null; // Resetea el input si excede el límite
    } else {
      // Guardar los archivos seleccionados en el estado
      setProducto({ ...producto, foto: Array.from(file) });
    }
  };

  const handleRemoveImage = async () => {
    try {
      await axios.delete(`http://localhost:3001/productos/${id}/foto`);
      setProducto({ ...producto, foto: '' }); // Actualizar el estado localmente después de eliminar la imagen
      setMessage('Imagen eliminada exitosamente.');
    } catch (error) {
      console.error(`Error al eliminar la imagen del producto con ID ${id}:`, error);
      setMessage('Error al eliminar la imagen del producto.');
    }
  };  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(producto).forEach(key => {
      {if(key==='fecha_ingreso'){
        formData.append(key, new Date().toISOString().split('T')[0]);
      }
      else if(key ==='foto'){
        console.log('xdxdxdx'+producto.foto)
        if(Array.isArray(producto.foto)){
           producto.foto.forEach((file) => {
          formData.append('foto', file);  // Agrega cada archivo con el nombre 'foto'
        });
        }
        else{
          formData.append('foto', producto.foto);
        }
      }
      else{
        formData.append(key, producto[key]);
      }}
    });

    try {
      console.log(formData.get('idUsuario'));
      await axios.put(`http://localhost:3001/productos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAgregado(true);
      setMessage('Producto actualizado exitosamente.');
      setTimeout(() => {
        setAgregado(false);
      navigate('/productos'); 
    }, 2000); // Navegar a la lista de productos después de 2 segundos
    } catch (error) {
      console.error(`Error al actualizar el producto con ID ${id}:`, error);
      setMessage('Error al actualizar el producto.');
    }
    

  };

  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
       <Navbar />
       <Sidebar />
      <div className="carrito-container mx-4 flex-1 ">
        <h2 className="pl-10 font-bold mb-5 ml-4 text-center text-4xl">Editar producto</h2>
      <p className="pl-10 font-light mb-8 ml-4 text-center text-1xl">Por favor, ingrese los datos que desea modificar.</p>
      {agregado && (
            <div className="bg-green-100 border border-green-400 text-green-700 py-5 mx-96 rounded relative mb-4" role="alert">
              <strong className="font-bold">¡Producto editado correctamente!</strong>
              {/*<p className="block sm:inline">Puedes ver el producto <a href={rutaProducto} className="text-blue-500 hover:underline">aquí</a>.</p>*/}
            </div>
          )}
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto grid grid-cols-2 gap-6">
          
  {/* Columna 1 */}
  <div>
    {/* Fecha de ingreso */}
    <div className="mb-4">
      <label htmlFor="fecha_ingreso" className="block text-gray-700 font-bold mb-2">Fecha ingreso</label>
      <input
        type="date"
        id="fecha_ingreso"
        name="fecha_ingreso"
        value={new Date().toISOString().split('T')[0]}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        disabled
      />
    </div>

    {/* SKU */}
    <div className="mb-4">
      <label htmlFor="sku" className="block text-gray-700 font-bold mb-2">SKU</label>
      <input
        type="text"
        id="sku"
        name="sku"
        value={producto.sku}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese el SKU del producto"
      />
    </div>

    {/* Nombre del producto */}
    <div className="mb-4">
      <label htmlFor="producto" className="block text-gray-700 font-bold mb-2">Nombre del producto</label>
      <input
        type="text"
        id="producto"
        name="producto"
        value={producto.producto}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese el nombre del producto"
      />
    </div>

    {/* Marca */}
    <div className="mb-4">
      <label htmlFor="Marca" className="block text-gray-700 font-bold mb-2">Marca</label>
      <input
        type="text"
        id="Marca"
        name="Marca"
        value={producto.Marca}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese la marca del producto"
      />
    </div>
  </div>

  {/* Columna 2 */}
  <div>
    {/* Precio */}
    <div className="mb-4">
      <label htmlFor="precio" className="block text-gray-700 font-bold mb-2">Precio</label>
      <input
        type="number"
        id="precio"
        name="precio"
        value={producto.precio}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese el precio del producto"
      />
    </div>

                  {/*Talla*/}
                  <div className="mb-4">
                <label htmlFor="idTalla" className="block text-gray-700 font-bold mb-2">
                  Talla
                </label>
                <select
                  type="number"
                  id="idTalla"
                  name="idTalla"
                  value={producto.idTalla}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >

                  <option value="" disabled>Selecciona la talla</option>
                  {tallas.map((talla) => (
                    <option key={talla.idTalla} value={talla.idTalla}>
                      {talla.talla}
                    </option>
                  ))}

                </select>
              </div>

              {/*Ofertas*/}
              <div className="mb-4">
                <label htmlFor="idOferta" className="block text-gray-700 font-bold mb-2">
                  Oferta a aplicar
                </label>

                <select
                 type="number"
                  id="idOferta"
                  name="idOferta"
                  value={producto.idOferta}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>Selecciona una oferta</option>
                  {ofertas.map((oferta) => (
                    <option key={oferta.idOferta} value={oferta.idOferta}>
                      {oferta.descripcion}
                    </option>
                  ))}

                </select>
              </div>

    {/* Cantidad */}
    <div className="mb-4">
      <label htmlFor="cantidad" className="block text-gray-700 font-bold mb-2">Existencias del producto</label>
      <input
        type="number"
        id="cantidad"
        name="cantidad"
        value={producto.cantidad}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Ingrese las existencias del producto"
        min="0" // Valor mínimo permitido
      />
    </div>
  </div>

  {/* Descripción */}
  <div className="col-span-2 mb-4">
    <label htmlFor="descripcion" className="block text-gray-700 font-bold mb-2">Descripción</label>
    <textarea
      id="descripcion"
      name="descripcion"
      value={producto.descripcion}
      onChange={handleChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      placeholder="Ingrese la descripción del producto"
    />
  </div>

  {/* Foto */}
  <div className="col-span-2 mb-4">
          <label htmlFor="current_images" className="block text-gray-700 font-bold mb-2">Fotos actuales</label>
          <div className="flex flex-wrap">
            {currentImage.length > 0 ? (
              currentImage.map((key, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001/images/${key}`}
                  alt={`Foto ${index + 1}`}
                  className="w-32 h-32 object-cover mr-4 mb-4"
                />
              ))
            ) : (
              <p>No hay imágenes disponibles.</p>
            )}
          </div>
        </div>
  <div className="col-span-2 mb-4">
    <label htmlFor="foto" className="block text-gray-700 font-bold mb-2">Foto</label>
    <input
      type="file"
      id="foto"
      name="foto"
      onChange={handleFileChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      multiple
    />
  </div>

  {/* Botón para actualizar */}
  <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-custom hover:bg-second text-black font-bold py-2 mt-5 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar
            </button>
            <div className="text-right items-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 mt-5  px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver
            </button>           
          </div>
          </div>
</form>

      </div>
      <div className="m-10">
       <FooterAdmin />
       </div>
    </div>
  );
};

export default EditarProducto;
