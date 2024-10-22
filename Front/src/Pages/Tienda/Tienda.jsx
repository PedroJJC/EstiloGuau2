import React, { useState, useEffect, useContext } from 'react';
import Navbar from "../../Components/Navbar/Navbar";
import { CartProvider } from '../../Context/CartContext';
import { UserContext } from '../../Context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import { Pagination, Checkbox, Label, Radio, Sidebar, RangeSlider } from "flowbite-react";
import axios from 'axios';
import {Tabs  } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import ListProductos from '../../Components/ListTienda/ListProducts';



function Tienda() {
  const { userData } = useContext(UserContext);
  //const { agregarAlCarrito } = useContext(CartContext);
  const { idUsuario } = userData; 
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);  // Este estado almacena las marcas
  const [showAllBrands, setShowAllBrands] = useState(false); // Estado para mostrar todas las marcas o solo las primeras 10
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16); // Número de productos por página
  const [filters, setFilters] = useState({
    temporada: '',
    precioMin: '',
    precioMax: '',
    marca: '',
    talla: '',
    tienda: ''
  });
  const [temporadas, setTemporadas] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [Tiendas, setTiendas] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [searchBrand, setSearchBrand] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(''); // Término después del debounce
  const [searchTerm, setSearchTerm] = useState(''); // El término que el usuario está escribiendo
  const [favorites, setFavorites] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [agregado, setAgregado] = useState(false);

  const navigate = useNavigate();



  // Efecto para actualizar el término de búsqueda con un debounce
  useEffect(() => {
    // Si el término tiene más de 2 letras, actualiza debouncedTerm después de 500ms
    const handler = setTimeout(() => {
      if (searchTerm.length > 2) {
        setDebouncedTerm(searchTerm);
      }
    }, 500);

    // Limpiar el timeout anterior si el término cambia antes de los 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Efecto para realizar la búsqueda cuando debouncedTerm cambie
  useEffect(() => {
    if (debouncedTerm) {
      // Aquí iría la lógica para realizar la búsqueda (puede ser un fetch o filtro local)
      console.log(`Realizando búsqueda con el término: ${debouncedTerm}`);
      // Ejemplo: Buscar productos que coincidan con el término
      // fetchProductos(debouncedTerm);
    }
  }, [debouncedTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término que el usuario escribe
  };


  // Obtener los productos desde la API
  useEffect(() => {


    const fetchProducts = async () => {
      try {
          const response = await fetch('http://localhost:3001/productos'); // Reemplaza con tu URL de API
          const data = await response.json();
  
          // Actualizar el estado con los productos y agregar el precio con descuento si aplica
          const updatedData = data.map(product => {
              // Suponiendo que 'descuento' es el campo que contiene el porcentaje de descuento
              if (product.porcentaje_descuento != 0) {
                  const precioConDescuento = product.precio * (1 - product.porcentaje_descuento / 100); // Calcular el precio con descuento
                  return {
                      ...product,
                      precioConDescuento, // Agregar el nuevo campo
                  };
              }
              return {
                  ...product,
                  precioConDescuento: 0 // Agregar el campo, sin descuento
              };
          });
  
          setProducts(updatedData); // Actualiza el estado con los productos modificados
          setFilteredProducts(updatedData); // También actualiza los productos filtrados
          console.log(updatedData); // Muestra los productos actualizados en la consola
  
          // Cargar marcas únicas y ordenarlas alfabéticamente
          const uniqueBrands = [...new Set(updatedData.map(product => product.Marca))].sort();
          setBrands(uniqueBrands); // Guardar las marcas en el estado, ordenadas alfabéticamente
      } catch (error) {
          console.error('Error fetching products:', error);
      }
  };
  

    const fetchFilters = async () => {
      try {
        const [temporadasResponse, tallasResponse, tiendaResponse] = await Promise.all([
          fetch('http://localhost:3001/temporada'), // Endpoint para temporadas
          fetch('http://localhost:3001/tallas'), // Endpoint para tallas
          fetch('http://localhost:3001/usuariogetidrol') // Endpoint para tallas
        ]);

        const temporadasData = await temporadasResponse.json();
        const tallasData = await tallasResponse.json();
        const tiendaData = await tiendaResponse.json();

        setTemporadas(temporadasData);
        //console.log(temporadasData)
        setTallas(tallasData);
        setTiendas(tiendaData);
        //console.log(tiendaData)
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };



    fetchProducts();
    fetchFilters();

  }, []);

  // Filtrar productos según los filtros seleccionados
  const filterProducts = () => {
    let updatedProducts = [...products];
    // Filtrar por temporada
    if (selectedSeasons.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        selectedSeasons.includes(product.idTemporada) // Cambiar a múltiples temporadas
      );
    }

    // Filtrar por precio
    if (filters.precioMin) {
      updatedProducts = updatedProducts.filter(product => product.precio >= parseFloat(filters.precioMin));
    }
    if (filters.precioMax) {
      updatedProducts = updatedProducts.filter(product => product.precio <= parseFloat(filters.precioMax));
    }


    // Filtrar por marca
    if (selectedBrands.length > 0) {
      updatedProducts = updatedProducts.filter(product => selectedBrands.includes(product.Marca));
    }

    // Filtrar por talla
    if (filters.talla) {
      updatedProducts = updatedProducts.filter(product => product.idTalla === Number(filters.talla));
    }
    // Filtrar por tiendas
    if (selectedStores.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        selectedStores.includes(product.idUsuario) // Cambiar a múltiples tiendas
      );
    }

    setFilteredProducts(updatedProducts);

  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    //filterProducts(); // Llamar a la función de filtrado
  };

  // Calcular los productos actuales de la página
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const handleApplyFilters = () => {
    filterProducts();
    setCurrentPage(1); // Reiniciar la página actual al aplicar filtros
  };

  // Función para manejar el cambio de selección de marcas
  const handleBrandChange = (brand) => {
    setSelectedBrands(prevSelectedBrands =>
      prevSelectedBrands.includes(brand)
        ? prevSelectedBrands.filter(item => item !== brand) // Si ya está seleccionada, se elimina
        : [...prevSelectedBrands, brand] // Si no está seleccionada, se agrega
    );
  };
  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(searchBrand.toLowerCase())
  );

  // Mostrar solo las primeras 10 marcas filtradas si `showAllBrands` es falso
  const displayedBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, 10);

  // Esta es la función que manejará los cambios de precio tanto para precio mínimo como máximo
  const handlePriceChange = (value, type) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSeasonChange = (seasonId) => {
    setSelectedSeasons(prevSelectedSeasons =>
      prevSelectedSeasons.includes(seasonId)
        ? prevSelectedSeasons.filter(id => id !== seasonId) // Eliminar si ya está seleccionado
        : [...prevSelectedSeasons, seasonId] // Agregar si no está seleccionado
    );
  };
  const handleStoreChange = (storeId) => {
    setSelectedStores(prevSelectedStores =>
      prevSelectedStores.includes(storeId)
        ? prevSelectedStores.filter(id => id !== storeId) // Eliminar si ya está seleccionado
        : [...prevSelectedStores, storeId] // Agregar si no está seleccionado
    );
  };

  const handleAgregarAlCarrito = (idProducto) => {
    if (idUsuario) {
      // Si el usuario está autenticado, procede a agregar el producto al carrito
      console.log(`Producto ${idProducto} agregado al carrito`);
      // Aquí podrías llamar a una función que maneje el proceso
    } else {
      // Si no está autenticado, redirige al login
      navigate('/Login');
    }
  };

  const handleFavorite = async (idProducto) => {
    // Verifica si hay un usuario logueado
    if (!idUsuario) {
      console.log('Por favor, inicia sesión para agregar a favoritos.');
        setAgregado(true);
        setTimeout(() => {
            setAgregado(false);
        }, 2000);
        return; // Salir de la función si no hay usuario logueado
    }

    // Verifica si el producto ya está en la lista de favoritos
    const esFavorito = favoritos.some(favorito => favorito.id === idProducto);

    if (esFavorito) {
      
      console.log(esFavorito);
        // Si ya es favorito, elimínalo
        try {
          console.log('ID Usuario:', idUsuario, 'ID Producto:', idProducto);
            await axios.delete(`http://localhost:3001/favoritosdelete/${idUsuario}/${idProducto}`);
            setFavoritos(favoritos.filter(favorito => favorito.id !== idProducto));
            console.log('Producto eliminado de favoritos');
            setAgregado(true);
            setTimeout(() => {
                setAgregado(false);
            }, 2000);
        } catch (error) {
            console.error('Error al eliminar el favorito', error);
        }
    } else {
        // Si no es favorito, agrégalo
        try {
            await axios.post('http://localhost:3001/guardar-favorito', {
              idProducto,
                idUsuario,
            });
            setFavoritos([...favoritos, { id: idProducto }]); // Actualiza el estado de favoritos
            console.log('Producto agregado a favoritos');
            setAgregado(true);
            setTimeout(() => {
                setAgregado(false);
            }, 2000);
        } catch (error) {
            console.error('Error al agregar el favorito', error);
        }
    }
};
// En el componente Tienda
useEffect(() => {
  const fetchFavorites = async () => {
    if (idUsuario) {
      try {
        const response = await axios.get(`http://localhost:3001/favoritos/${idUsuario}`);
        const favoritos = response.updatedData.map(fav => fav.idProducto);
        setFavorites(favoritos);
      } catch (error) {
        console.error('Error al obtener los favoritos:', error);
      }
    }
  };

  fetchFavorites();
}, [idUsuario]);
const [carrito, setCarrito] = useState(() => {
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
  return carritoGuardado || [];
});

// Guardar el carrito en localStorage cada vez que cambie

  return (
<div className="flex flex-col min-h-screen pt-28">
<CartProvider>
  <Navbar /> {/* Navbar arriba */}
  </CartProvider>
  
  <div className="flex flex-1">
    {/* Sidebar de Filtros a la izquierda */}
    <Sidebar className="w-1/5 border-r p-10">
      <h1 className="font-bold text-3xl mb-8">Filtros</h1>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Marca */}
          <Sidebar.Collapse label="Marca">
            <Sidebar.Item>
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Buscar marca"
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  className="p-2 border border-gray-100 rounded w-full mb-2"
                />
                {displayedBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      value={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <Label htmlFor={brand}>{brand}</Label>
                  </div>
                ))}
                {!showAllBrands && filteredBrands.length > 10 && (
                  <button
                    className="text-blue-500 mt-2"
                    onClick={() => setShowAllBrands(true)}
                  >
                    Ver todas las marcas
                  </button>
                )}
                {showAllBrands && (
                  <button
                    className="text-blue-500 mt-2"
                    onClick={() => setShowAllBrands(false)}
                  >
                    Ver menos
                  </button>
                )}
              </div>
            </Sidebar.Item>
          </Sidebar.Collapse>

          {/* Temporada */}
          <Sidebar.Collapse label="Temporada">
            <Sidebar.Item>
              <div className="mt-4">
                {temporadas.map((temporada) => (
                  <div key={temporada.idTemporada} className="flex items-center space-x-2">
                    <Checkbox
                      id={`temporada-${temporada.idTemporada}`}
                      checked={selectedSeasons.includes(temporada.idTemporada)}
                      onChange={() => handleSeasonChange(temporada.idTemporada)}
                    />
                    <Label htmlFor={`temporada-${temporada.idTemporada}`}>
                      {temporada.nombre}
                    </Label>
                  </div>
                ))}
                <button
                  onClick={() => setSelectedSeasons([])}
                  className="text-blue-500 mt-2"
                >
                  Limpiar selección
                </button>
              </div>
            </Sidebar.Item>
          </Sidebar.Collapse>

          {/* Tallas */}
          <Sidebar.Collapse label="Tallas">
            <Sidebar.Item>
              <div className="mt-4">
                {tallas.map((talla) => (
                  <div key={talla.idTalla} className="flex items-center space-x-2">
                    <Radio
                      id={`talla-${talla.idTalla}`}
                      name="talla"
                      value={talla.idTalla}
                      checked={filters.talla === String(talla.idTalla)}
                      onChange={handleFilterChange}
                    />
                    <Label htmlFor={`talla-${talla.idTalla}`}>{talla.talla}</Label>
                  </div>
                ))}
                <button
                  onClick={() => setFilters({ talla: '' })}
                  className="text-blue-500 mt-2"
                >
                  Limpiar selección
                </button>
              </div>
            </Sidebar.Item>
          </Sidebar.Collapse>

          {/* Precio Mínimo y Máximo */}
          <Sidebar.Item>
            <Label className="block mt-4">Precio Mínimo: ${filters.precioMin}</Label>
            <RangeSlider
              min={0}
              max={1000}
              step={10}
              value={filters.precioMin}
              onChange={(e) => handlePriceChange(Number(e.target.value), 'precioMin')}
            />
            <Label className="block mt-4">Precio Máximo: ${filters.precioMax}</Label>
            <RangeSlider
              min={filters.precioMin}
              max={1000}
              step={10}
              value={filters.precioMax}
              onChange={(e) => handlePriceChange(Number(e.target.value), 'precioMax')}
            />
            <button
              onClick={() => setFilters({ precioMin: 0, precioMax: 1000 })}
              className="text-blue-500 mt-4"
            >
              Restablecer Precios
            </button>
          </Sidebar.Item>

          {/* Tiendas */}
          <Sidebar.Collapse label="Tiendas">
            <Sidebar.Item>
              <div className="mt-4">
                {Tiendas.map((tienda) => (
                  <div key={tienda.idUsuario} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tienda-${tienda.idUsuario}`}
                      checked={selectedStores.includes(tienda.idUsuario)}
                      onChange={() => handleStoreChange(tienda.idUsuario)}
                    />
                    <Label htmlFor={`tienda-${tienda.idUsuario}`}>{tienda.nombre}</Label>
                  </div>
                ))}
                <button
                  onClick={() => setSelectedStores([])}
                  className="text-blue-500 mt-2"
                >
                  Limpiar selección
                </button>
              </div>
            </Sidebar.Item>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      <button
        onClick={handleApplyFilters}
        className="bg-custom text-black py-2 mt-4 rounded hover:bg-second w-full"
      >
        Aplicar Filtros
      </button>
    </Sidebar>
    <CartProvider>
<ListProductos/>
</CartProvider>
  </div>

</div>
  );
}

export default Tienda;
