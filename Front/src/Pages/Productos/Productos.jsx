import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';
import { UserContext } from '../../Context/UserContext';
import { Pagination } from "flowbite-react";

const Productos = () => {

  const [productos, setProductos] = useState([]);
  const { userData } = useContext(UserContext);
  const { idRol } = userData;
  //console.log(idRol)
  const [currentPage, setCurrentPage] = useState(1);
  const [productosPerPage] = useState(5);

  useEffect(() => {
   //  console.log('User Data:', userData.idVendedor); Verifica qué datos estás obteniendo
    if (idRol === 2) {
     // console.log(`Obteniendo productos para el vendedor: ${userData.idVendedor}`);
      obtenerProductos(`/productosidus/${userData.idVendedor}`);
    } else if (idRol === 3) {
      obtenerProductos(`/productos`);
    }
  }, [idRol]);

  const obtenerProductos = async (ruta) => {
    try {
      const response = await axios.get(`http://localhost:3001${ruta}`);
      setProductos(response.data);
      console.log('Productos recibidos:', response.data);
      //console.log(productos)
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const eliminarProducto = async (idProducto) => {
    try {
      await axios.delete(`http://localhost:3001/productos/${idProducto}`);
      setProductos(productos.filter(producto => producto.idProducto !== idProducto));
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${idProducto}:`, error);
    }
  };

 // Calcular los índices de los elementos a mostrar
 const indexOfLastProducto = currentPage * productosPerPage;
 const indexOfFirstProducto = indexOfLastProducto - productosPerPage;
 const currentProductos = productos.slice(indexOfFirstProducto, indexOfLastProducto);
 const totalPages = Math.ceil(productos.length / productosPerPage);


 return (
  <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
    <Navbar />
    <Sidebar />
    
    <div className="carrito-container mx-4 flex-1">
      <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Productos en venta</h2>
      <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl">Resumen de todos los productos</p>
      
      <div className="flex justify-start pb-10">
        <Link to="/productos/formulario">
          <button className="bg-custom border hover:bg-second text-black font-medium py-2 px-4 rounded">
            Agregar Producto
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-black">
          <thead className="bg-custom text-black text-medium">
            <tr>
              <th className="py-3 px-4 text-center border border-white-900">Último movimiento</th>
              <th className="py-3 px-4 text-center border border-white-900">Imagen</th>
              <th className="py-3 px-4 text-center border border-white-900">Producto</th>
              <th className="py-3 px-4 text-center border border-white-900">Descripción</th>
              <th className="py-3 px-4 text-center border border-white-900">Marca</th>
              <th className="py-3 px-4 text-center border border-white-900">Editar</th>
              <th className="py-3 px-4 text-center border border-white-900">Eliminar</th>
              <th className="py-3 px-4 text-center border border-white-900">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {currentProductos.map(producto => (
              <tr key={producto.idProducto}>
                <td className="py-3 px-4 border border-gray-300">
                  {new Date(producto.fecha_ingreso).toISOString().split('T')[0]}
                </td>
                <td className="py-2 px-2 text-center border border-gray-300">
                  {producto.foto && (
                    <img 
                      src={`http://localhost:3001/images/${producto.foto.split(',')[0]}`} // Muestra solo el primer archivo
                      alt="Producto" 
                      className="w-20 h-20 object-cover rounded mx-auto" 
                    />
                  )}
                </td>
                <td className="py-3 px-4 border border-gray-300">{producto.producto}</td>
                <td className="py-3 px-4 border border-gray-300">{producto.descripcion}</td>
                <td className="py-3 px-4 border border-gray-300">{producto.Marca}</td>
                <td className="py-3 px-4 text-center border border-gray-300">
                  <Link to={`/productos/editar/${producto.idProducto}`}>
                    <button className="bg-[#CDD5AE] border hover:bg-second text-black font-bold rounded-md px-4 py-2">
                      Editar
                    </button>
                  </Link>
                </td>
                <td className="py-3 px-4 text-center border border-gray-300">
                  <button
                    className="bg-white-500 hover:text-second text-custom font-bold py-1 px-2 rounded w-22"
                    onClick={() => eliminarProducto(producto.idProducto)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
                <td className="py-3 px-4 text-center border border-gray-300">
                  <button
                    className="bg-white-500 hover:text-second text-custom font-bold py-1 px-2 rounded w-22"
                    onClick={() => eliminarProducto(producto.idProducto)}
                  >
<svg class=" text-custom dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m14 9.006h-.335a1.647 1.647 0 0 1-1.647-1.647v-1.706a1.647 1.647 0 0 1 1.647-1.647L19 12M5 12v5h1.375A1.626 1.626 0 0 0 8 15.375v-1.75A1.626 1.626 0 0 0 6.375 12H5Zm9 1.5v2a1.5 1.5 0 0 1-1.5 1.5v0a1.5 1.5 0 0 1-1.5-1.5v-2a1.5 1.5 0 0 1 1.5-1.5v0a1.5 1.5 0 0 1 1.5 1.5Z"/>
</svg>
                  </button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="9" className="py-4 px-6 text-center text-gray-500">
                  No hay productos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Componente de paginación de Flowbite */}
      <div className="text-center mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} // Cambiar la página
          className="flex justify-center"
        />
      </div>

    </div>      

    <div className="m-10">
      <Footer />
    </div>
  </div>
);
};

export default Productos;