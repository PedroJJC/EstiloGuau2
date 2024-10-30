import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import FooterAdmin from "../../Components/Footer/FooterAdmin";
import Sidebar from '../../Components/Sidebar/Sidebar';
import { UserContext } from '../../Context/UserContext';

const FormularioProducto = () => {
  const { userData } = useContext(UserContext);
  const [vistaFormulario, setVistaFormulario] = useState(1); // Estado para cambiar entre formularios
  const [ofertas, setOfertas] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [agregado, setAgregado] = useState(false);
  const [mostrarPrimerFormulario, setMostrarPrimerFormulario] = useState(true); // Estado para alternar formularios

  const navigate = useNavigate();

  useEffect(() => {
    obtenerOfertas();
    obtenerTallas();
    obtenerTemporadas();
    const today = new Date().toISOString().split('T')[0];
    setProducto((prevProducto) => ({ ...prevProducto, fecha_ingreso: today }));
  }, []);

  const obtenerOfertas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/all-ofertas');
      setOfertas(response.data);
    } catch (error) {
      console.error('Error al obtener las ofertas:', error);
    }
  };

  const obtenerTemporadas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/temporada');
      setTemporadas(response.data);
    } catch (error) {
      console.error('Error al obtener las temporadas:', error);
    }
  };

  const obtenerTallas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tallas');
      setTallas(response.data);
    } catch (error) {
      console.error('Error al obtener las tallas:', error);
    }
  };

  const [producto, setProducto] = useState({
    sku: '', producto: '', Marca: '', precio: '', idTalla: '', idTemporada: '',
    descripcion: '', foto: [], idOferta: '', fecha_ingreso: '', cantidad: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProducto((prevProducto) => ({
      ...prevProducto,
      foto: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mostrarPrimerFormulario) {
      setMostrarPrimerFormulario(false);
      setVistaFormulario(2);
    } else {
      // Realiza la solicitud a la API cuando el formulario finaliza
      const formData = new FormData();
      formData.append('sku', producto.sku);
      formData.append('producto', producto.producto);
      formData.append('Marca', producto.Marca);
      formData.append('precio', producto.precio);
      formData.append('idTalla', producto.idTalla);
      formData.append('idTemporada', producto.idTemporada);
      formData.append('descripcion', producto.descripcion);
      formData.append('idOferta', producto.idOferta);
      formData.append('idVendedor', userData.idVendedor);
      formData.append('fecha_ingreso', producto.fecha_ingreso);
      formData.append('cantidad', producto.cantidad);

      producto.foto.forEach((file) => formData.append('foto', file));

      try {
        const response = await axios.post('http://localhost:3001/producto-nuevo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.status === 201) {
          setAgregado(true);
          setTimeout(() => {
            setAgregado(false);
            navigate('/productos');
          }, 2000);
        }
      } catch (error) {
        console.error('Error al agregar el producto:', error);
      }
    }
  };


  return (
    <div className="pl-72 pt-28 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
      <Navbar />
      <Sidebar />
      <div className="carrito-container mx-5 flex-1">
        <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Nuevo producto</h2>
        {agregado && (
          <div className="bg-green-100 border border-green-400 text-green-700 py-5 mx-32 rounded relative mb-4" role="alert">
            <strong className="font-bold">¡Producto agregado correctamente!</strong>
          </div>
        )}

        {/* Formulario Principal */}
        {mostrarPrimerFormulario ? (
          <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto h-auto space-y-4">
   <div className="grid grid-cols-2 gap-6 text-left h-auto">
              {/*fecha_ingreso*/}
              <div className="col-span-2">
                <label htmlFor="fecha_ingreso" className="block text-gray-700 font-bold mb-2">                 
                </label>
                <input
                  type="date"
                  id="fecha_ingreso"
                  name="fecha_ingreso"
                  value={producto.fecha_ingreso}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese la fecha de ingreso del producto"
                  hidden
                />
              </div>
              {/*sku*/}
              <div className="mb-2">
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
              <div className="mb-2">
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
              <div className="mb-2">
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
              <div className="mb-2">
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

              {/*Descripcion*/}
              <div className="col-span-2 mb-2">
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


              {/*Foto*/}
              <div className="col-span-2 mb-2">
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

            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 mt-5 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver
            </button>    
            <button
              type="submit"
              className="bg-custom hover:bg-second text-black font-bold py-2 m-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Continuar
            </button>
          </form>
        ) : (
          // Formulario Secundario
          <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto h-auto space-y-4">
            {/* Campos del segundo formulario */}
            <div className="mb-4">
              <label htmlFor="idTalla" className="block text-gray-700 font-bold mb-2">Talla</label>
              <select
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
                          <div className="mb-2">
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

                {/*Ofertas*/}
                <div className="mb-2">
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

            {/* Botón para regresar al primer formulario */}
            <button
              type="button"
              onClick={() => setMostrarPrimerFormulario(true)} // Cambia el estado para regresar al primer formulario
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 m-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver
            </button>
            <button
              type="submit"
              className="bg-custom hover:bg-second text-black font-bold py-2 m-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Guardar
            </button>
          </form>
        )}
      </div>
      <div className="m-10">
        <FooterAdmin />
      </div>
    </div>
  );
};

export default FormularioProducto;
