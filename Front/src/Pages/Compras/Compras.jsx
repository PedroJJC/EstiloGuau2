import React, { useEffect, useState, useContext } from "react";
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from "../../Components/Footer/Footer";
import { UserContext } from '../../Context/UserContext';
import { Pagination } from "flowbite-react";

const Compras = () => {
    const { userData } = useContext(UserContext);
    const { idRol, idUsuario } = userData;
    const [compras, setCompras] = useState([]);
    const [clientesRecientes, setClientesRecientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [comprasPerPage] = useState(5); // Número de compras por página

    // useEffect para obtener compras dependiendo del rol
    useEffect(() => {
        const fetchCompras = async () => {
            try {
                let url;
                if (idRol === 2) {
                    url = `http://localhost:3001/comprasxus/${idUsuario}`;
                } else if (idRol === 3) {
                    url = `http://localhost:3001/compras`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('No se pudieron obtener las compras');
                }
                const data = await response.json();
                setCompras(data);
            } catch (error) {
                console.error('Error al obtener las compras:', error);
            }
        };

        fetchCompras();
    }, [idRol]);

    // useEffect para obtener clientes recientes
    useEffect(() => {
        const fetchClientesRecientes = async () => {
            try {
                const response = await fetch('http://localhost:3001/clientes-recientes');
                if (!response.ok) {
                    throw new Error('No se pudieron obtener los clientes recientes');
                }
                const data = await response.json();
                setClientesRecientes(data);
            } catch (error) {
                console.error('Error al obtener los clientes recientes:', error);
            }
        };

        fetchClientesRecientes();
    }, []);

    // Calcular los índices de los elementos a mostrar
    const indexOfLastCompra = currentPage * comprasPerPage;
    const indexOfFirstCompra = indexOfLastCompra - comprasPerPage;
    const currentCompras = compras.slice(indexOfFirstCompra, indexOfLastCompra);

    const totalPages = Math.ceil(compras.length / comprasPerPage);

    return (
      <div className="pl-72 pt-20 pr-24 flex flex-col min-h-screen shadow-lg">
          <Navbar />
          <Sidebar />
          <div className="mx-4 flex-1">
              <h2 className="font-bold mb-4 text-center text-4xl">Ventas realizadas</h2>
              <p className="font-light mb-4 text-center text-1xl">Resumen de todas las ventas realizadas por los usuarios</p>

              <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-400">
                      <thead>
                          <tr className="bg-custom border border-gray-400">
                              <th className="py-3 px-4 border border-gray-400">Folio de compra</th>
                              <th className="py-3 px-4 border border-gray-400">Descripción</th>
                              <th className="py-3 px-4 border border-gray-400">Precio</th>
                              <th className="py-3 px-4 border border-gray-400">Cantidad</th>
                              <th className="py-3 px-4 border border-gray-400">Cliente</th>
                          </tr>
                      </thead>
                      <tbody className="border-collapse border border-gray-400 text-center items-center">
                          {currentCompras.map((compra) => (
                              <tr key={compra.idCompra}>
                                  <td className="py-1 px-2 border border-gray-400">{compra.idCompra}</td>
                                  <td className="flex items-center py-1 px-2 border border-gray-300">
                                      <img src={`http://localhost:3001/images/${compra.primera_foto}`} alt="" className="h-20 p-3" />
                                      <div className="flex flex-col">
                                          <span>{compra.descripcion_producto}</span>
                                          <span className="font-light">Talla: {compra.nombre_talla}</span>
                                      </div>
                                  </td>
                                  <td className="py-3 px-4 border border-gray-400">{compra.precio}</td>
                                  <td className="py-3 px-4 border border-gray-400">{compra.cantidad_producto}</td>
                                  <td className="py-3 px-4 border border-gray-400">{compra.cliente}</td>
                              </tr>
                          ))}
                          {compras.length === 0 && (
                              <tr>
                                  <td colSpan="5" className="py-4 px-6 text-center text-gray-500 border-gray-300">
                                      No hay compras disponibles.
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
           <div className="">
              <Footer/>
              </div>
      </div>
  );
};

export default Compras;