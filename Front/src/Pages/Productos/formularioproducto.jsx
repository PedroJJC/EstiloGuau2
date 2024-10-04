import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../Components/Navbar/NavbarAdmin';
import FooterAdmin from "../../Components/Footer/FooterAdmin";
import Sidebar from '../../Components/Sidebar/Sidebar';
import { UserContext } from '../../Context/UserContext';

const FormularioProducto = () => {
  const { userData } = useContext(UserContext);

  useEffect(() => {
    obtenerOfertas();
    obtenerTallas();
    obtenerTemporadas();
    const today = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    setProducto((prevProducto) => ({
      ...prevProducto,
      fecha_ingreso: today
    }));
  }, []);

  const obtenerOfertas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/all-ofertas');
      setofertas(response.data);
      //console.log(response.data)
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };
  const obtenerTemporadas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/temporada');
      setTemporadas(response.data);
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


  const [ofertas, setofertas] = useState([]);
  const [tallas, settallas] = useState([]);
  const [temporadas, setTemporadas] = useState([]);

  const [producto, setProducto] = useState({
    sku: '',
    producto: '',
    Marca: '',
    precio: '',
    idTalla: '',
    idTemporada: '',
    descripcion: '',
    foto: [],
    idOferta: '',
    fecha_ingreso: '',
    cantidad: '',
    obtenerOfertas,
    obtenerTallas,
    obtenerTemporadas
  });

  const [agregado, setAgregado] = useState(false);
  //const [rutaProducto, setRutaProducto] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('sku', producto.sku);
      formData.append('producto', producto.producto);
      formData.append('Marca', producto.Marca);
      formData.append('precio', producto.precio);
      formData.append('idTalla', producto.idTalla);
      formData.append('idTemporada', producto.idTemporada);
      formData.append('descripcion', producto.descripcion);
      formData.append('idOferta', producto.idOferta);
      formData.append('idUsuario', userData.idUsuario);
      formData.append('fecha_ingreso', producto.fecha_ingreso);
      formData.append('cantidad', producto.cantidad);


      // Agregar las imágenes seleccionadas
      producto.foto.forEach((file) => {
        formData.append('foto', file);  // Agrega cada archivo con el nombre 'foto'
      });



      const response = await axios.post('http://localhost:3001/producto-nuevo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });


      if (response.status === 201) {
        setAgregado(true);
        
        // Redirigir a la página de productos después de 2 segundos
        setTimeout(() => {
          setAgregado(false); // Limpiar el mensaje de éxito después de la redirección
          navigate('/productos');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };



  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
       <NavbarAdmin />
      <Sidebar />
      

        <div className="carrito-container mx-5 flex-1">
          <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Nuevo producto</h2>
          <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl pb-5">Por favor, ingrese los datos solicitados del producto, recuerde que todos lo campos son necesarios.</p>
          {agregado && (
            <div className="bg-green-100 border border-green-400 text-green-700 py-5 mx-32 rounded relative mb-4" role="alert">
              <strong className="font-bold">¡Producto agregado correctamente!</strong>
              {/*<p className="block sm:inline">Puedes ver el producto <a href={rutaProducto} className="text-blue-500 hover:underline">aquí</a>.</p>*/}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto h-auto space-y-6">
            <div className="grid grid-cols-2 gap-6 text-left h-auto">
              {/*fecha_ingreso*/}
              <div className="mb-4">
                <label htmlFor="fecha_ingreso" className="block text-gray-700 font-bold mb-2">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  id="fecha_ingreso"
                  name="fecha_ingreso"
                  value={producto.fecha_ingreso}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese la fecha de ingreso del producto"
                  disabled
                />
              </div>
              {/*sku*/}
              <div className="mb-4">
                <label htmlFor="sku" className="block text-gray-700 font-bold mb-2">
                  SKU
                </label>
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
              {/*Nombre*/}
              <div className="mb-4">
                <label htmlFor="producto" className="block text-gray-700 font-bold mb-2">
                  Nombre Producto
                </label>
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
              {/*Marca*/}
              <div className="mb-4">
                <label htmlFor="Marca" className="block text-gray-700 font-bold mb-2">
                  Marca
                </label>
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
              {/*Temporada*/}
              <div className="mb-4">
                <label htmlFor="idTemporada" className="block text-gray-700 font-bold mb-2">
                  Temporada
                </label>
                <select
                  type="number"
                  id="idTemporada"
                  name="idTemporada"
                  value={producto.idTemporada}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >

                  <option value="" disabled>Selecciona la temporada</option>
                  {temporadas.map((temporada) => (
                    <option key={temporada.idTemporada} value={temporada.idTemporada}>
                      {temporada.nombre}
                    </option>
                  ))}

                </select>
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
              {/*precio*/}
              <div className="mb-4">
                <label htmlFor="precio" className="block text-gray-700 font-bold mb-2">
                  Precio
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={producto.precio}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese el precio del producto"
                  min="0" // Valor mínimo permitido
                  step="0.01" // Incremento permitido (útil para precios decimales)
                />
              </div>
              {/*Descripcion*/}
              <div className="col-span-2 mb-4">
                <label htmlFor="descripcion" className="block text-gray-700 font-bold mb-2">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={producto.descripcion}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese la descripción del producto"
                />
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
              {/*Existencias*/}
              <div className="mb-4">
                <label htmlFor="cantidad" className="block text-gray-700 font-bold mb-2">
                  Existencias del producto
                </label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={producto.cantidad}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese la cantidad del producto"
                />
              </div>
              {/*Foto*/}
              <div className="col-span-2 mb-4">
                <label htmlFor="foto" className="block text-gray-700 font-bold mb-2">
                  Foto
                </label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  onChange={handleFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  multiple
                />
              </div>
            </div>

  {/* Botón para guardar */}
  <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-custom hover:bg-second text-black font-bold py-2 mt-5 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar
            </button>
            <div className="items-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 mt-5 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default FormularioProducto;
