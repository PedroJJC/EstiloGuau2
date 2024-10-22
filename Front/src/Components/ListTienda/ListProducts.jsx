import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../Context/CartContext';
import { UserContext } from '../../Context/UserContext';
import Navbar from "../Navbar/Navbar";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { Tabs } from "flowbite-react";
import axios from 'axios';

const ListProducts = () => {
  const {agregarAlCarrito} = useContext(CartContext);
  const { userData } = useContext(UserContext);
  const { idUsuario } = userData; 
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);
  const [filters, setFilters] = useState({
    temporada: '',
    precioMin: '',
    precioMax: '',
    marca: '',
    talla: '',
    tienda: ''
  });
  const [favoritos, setFavoritos] = useState([]);
  const [agregado, setAgregado] = useState(false);
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem('carrito')) || []);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos');
        const data = await response.json();
        const updatedData = data.map(product => ({
          ...product,
          precioConDescuento: product.porcentaje_descuento ? product.precio * (1 - product.porcentaje_descuento / 100) : product.precio
        }));
        setProducts(updatedData);
        setFilteredProducts(updatedData);
        const uniqueBrands = [...new Set(updatedData.map(product => product.Marca))].sort();
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);


  const handleFavorite = async (idProducto) => {
    if (!idUsuario) {
      console.log('Por favor, inicia sesión para agregar a favoritos.');
      setAgregado(true);
      setTimeout(() => setAgregado(false), 2000);
      return;
    }

    const esFavorito = favoritos.some(favorito => favorito.id === idProducto);
    try {
      if (esFavorito) {
        await axios.delete(`http://localhost:3001/favoritosdelete/${idUsuario}/${idProducto}`);
        setFavoritos(favoritos.filter(favorito => favorito.id !== idProducto));
        console.log('Producto eliminado de favoritos');
      } else {
        await axios.post('http://localhost:3001/guardar-favorito', { idProducto, idUsuario });
        setFavoritos([...favoritos, { id: idProducto }]);
        console.log('Producto agregado a favoritos');
      }
      setAgregado(true);
      setTimeout(() => setAgregado(false), 2000);
    } catch (error) {
      console.error('Error al manejar favoritos', error);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const onPageChange = (page) => setCurrentPage(page);

  return (
    <div className="flex flex-col min-h-screen pt-28">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-3/4 p-3 flex flex-col">
          <div className="flex justify-end">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18l6-6M4 10a6 6 0 1112 0 6 6 0 01-12 0z" />
                </svg>
              </div>
            </div>
          </div>

          <Tabs aria-label="Default tabs" variant="default" className="flex-grow">
            <Tabs.Item active title="Todos los productos">
              <div className="products grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {currentProducts.map(producto => (
                  <div key={producto.idProducto} className="product border p-4 rounded shadow-lg text-center">
                    <img src={`http://localhost:3001/images/${producto.primera_foto}`} alt="Producto" className="w-64 h-64 object-cover mx-auto mb-6" />
                    <Link to={`/detalleproducto/${producto.idProducto}`}>
                      <h2 className="text-xl font-semibold mb-2">{producto.producto}</h2>
                    </Link>
                    <p className="text-lg mb-4">
                      ${producto.precioConDescuento !== 0 ? producto.precioConDescuento.toFixed(2) : producto.precio.toFixed(2)}
                    </p>
                    <div className="flex flex-row items-center justify-between">
                      <button className="p-1 m-1 bg-custom hover:bg-second" onClick={() => agregarAlCarrito(producto)}>
                        Agregar al carrito
                      </button>
                      <Link to="/resumencompra">
                        <button className="p-5 m-1 bg-custom hover:bg-second">Comprar</button>
                      </Link>
                      <button onClick={() => handleFavorite(producto.idProducto)} className={`p-2 rounded ${favoritos.some(fav => fav.id === producto.idProducto) ? 'text-red-500' : 'text-gray-300'}`}>
                        <svg className="w-[24px] h-[24px]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.75 20.66l6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 00.743-.34z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListProducts;
