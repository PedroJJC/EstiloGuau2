import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../Context/CartContext';
import { UserContext } from '../../Context/UserContext';
import Navbar from "../../Components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import { Pagination, Checkbox, Label, Radio, Sidebar, RangeSlider, SidebarCollapse } from "flowbite-react";
import axios from 'axios';

function Tienda() {
  const { userData } = useContext(UserContext);
  //const { agregarAlCarrito } = useContext(CartContext);
  const { idUsuario } = userData;

  // Estados para productos, filtros y marcas
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [Ofertas, setOfertas] = useState([]);
  //const [Tienda, setTiendas] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  //const [selectedSize, setSelectedSize] = useState([]);
  const [searchBrand, setSearchBrand] = useState('');
  const [filters, setFilters] = useState({
    temporada: '',
    precioMin: '',
    precioMax: '',
    marca: '',
    talla: '',
    tienda: '',
    oferta: '' 
  });

  // Estados para búsqueda y paginación
 // const [debouncedTerm, setDebouncedTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);

  // Estados para favoritos y carrito
  //const [favorites, setFavorites] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  //const [agregado, setAgregado] = useState(false);
  /*const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    return carritoGuardado || [];
  });*/

  const navigate = useNavigate();

  /* Efecto para actualizar el término de búsqueda con un debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length > 10) {
        setDebouncedTerm(searchTerm);
      }
    }, 1000000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Efecto para realizar la búsqueda cuando cambia `debouncedTerm`
  useEffect(() => {
    if (debouncedTerm) {
      // Lógica de búsqueda
    }
  }, [debouncedTerm]);*/

  //Buscador
  useEffect(() => {
    setFilteredProducts(
      products.filter(product => 
        (product.producto && product.producto.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, products]);

  // Obtener productos y filtros desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos');
        const data = await response.json();
        const updatedData = data.map(product => {
          const precioConDescuento = product.porcentaje_descuento
            ? product.precio * (1 - product.porcentaje_descuento / 100)
            : 0;
          return { ...product, precioConDescuento };
        });
        setProducts(updatedData);
        setFilteredProducts(updatedData);

        const uniqueBrands = [...new Set(updatedData.map(product => product.Marca))].sort();
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchFilters = async () => {
      try {
        const [temporadasResponse, tallasResponse, tiendaResponse] = await Promise.all([
          fetch('http://localhost:3001/temporada'),
          fetch('http://localhost:3001/tallas'),
          fetch('http://localhost:3001/all-ofertas')
        ]);

        const temporadasData = await temporadasResponse.json();
        const tallasData = await tallasResponse.json();
        const ofertaData = await tiendaResponse.json();

        setTemporadas(temporadasData);
        setTallas(tallasData);
        setOfertas(ofertaData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchProducts();
    fetchFilters();
  }, []);

  // Efecto para obtener favoritos
  useEffect(() => {
    const fetchFavorites = async () => {
      if (idUsuario) {
        try {
          const response = await axios.get(`http://localhost:3001/favoritos/${idUsuario}`);
          const favoritos = response.data.map(fav => fav.idProducto);
          setFavorites(favoritos);
        } catch (error) {
          console.error('Error al obtener los favoritos:', error);
        }
      }
    };
    fetchFavorites();
  }, [idUsuario]);

  // Función para manejar el cambio en el término de búsqueda
  const handleChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza directamente el término que el usuario escribe
  };
  // Filtrar productos según los filtros seleccionados
  const filterProducts = () => {
    let updatedProducts = [...products];
    if (selectedSeasons.length) updatedProducts = updatedProducts.filter(product => selectedSeasons.includes(product.idTemporada));
    if (filters.precioMin) updatedProducts = updatedProducts.filter(product => product.precio >= parseFloat(filters.precioMin));
    if (filters.precioMax) updatedProducts = updatedProducts.filter(product => product.precio <= parseFloat(filters.precioMax));
    if (selectedBrands.length) updatedProducts = updatedProducts.filter(product => selectedBrands.includes(product.Marca));
    if (filters.talla) {
      updatedProducts = updatedProducts.filter(product => 
        product.tallas_disponibles.split(',').includes(filters.talla)
      );}
      
      if (filters.oferta) {
        updatedProducts = updatedProducts.filter(product => 
          product.ofertas.split(',').includes(String(filters.oferta))
        );
      }
      
      
    setFilteredProducts(updatedProducts);
  };

  // Manejo de cambios en filtros y paginación
  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const onPageChange = (page) => setCurrentPage(page);
  const handleApplyFilters = () => {
    filterProducts();
    setCurrentPage(1);
  };

  // Funciones para manejar cambios en marcas, temporadas y tiendas
  const handleBrandChange = (brand) => {
    setSelectedBrands(prevSelectedBrands =>
      prevSelectedBrands.includes(brand) ? prevSelectedBrands.filter(item => item !== brand) : [...prevSelectedBrands, brand]
    );
  };
  const handleSeasonChange = (seasonId) => {
    setSelectedSeasons(prevSelectedSeasons =>
      prevSelectedSeasons.includes(seasonId) ? prevSelectedSeasons.filter(id => id !== seasonId) : [...prevSelectedSeasons, seasonId]
    );
  };
  const handleOfferChange = (OfferId) => {
    setFilters((prev) => ({
      ...prev,
      oferta: OfferId,  // Aquí asegúrate de actualizar correctamente el filtro
    }));
  };

  const handlePriceChange = (value, type) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  // Función para manejar favoritos
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
      } else {
        await axios.post('http://localhost:3001/guardar-favorito', { idProducto, idUsuario });
        setFavoritos([...favoritos, { id: idProducto }]);
      }
      setAgregado(true);
      setTimeout(() => setAgregado(false), 2000);
    } catch (error) {
      console.error('Error al manejar favoritos', error);
    }
  };

  // Manejador de cambio de búsqueda
const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
};
  
  // Variables de paginación y marcas mostradas
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const filteredBrands = brands.filter((brand) => brand.toLowerCase().includes(searchBrand.toLowerCase()));
  const displayedBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen pt-28">
      <Navbar /> {/* Navbar arriba */}

      <div className="flex flex-1">
        {/* Sidebar de Filtros a la izquierda */}
        <Sidebar className="w-1/5 border-r p-10">
          <h1 className="font-bold text-3xl mb-8">Filtros</h1>
          <Sidebar.Items >
            <Sidebar.ItemGroup className='py-2'>
              {/* Marca */}
              <Sidebar.Collapse label="Marca"  className='shadow-md my-5 my-5'>
                <Sidebar.Item>
                  <div className="p-4">
                    {/*<input
                      type="text"
                      placeholder="Buscar marca"
                      value={searchBrand}
                      onChange={(e) => setSearchBrand(e.target.value)}
                      className="p-2 border border-gray-100 rounded w-full mb-2"
                    />*/}
                    {displayedBrands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-3 space-y-2 ">
                        <Checkbox
                          id={brand}
                          value={brand}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />
                        <Label htmlFor={brand}>{brand}</Label>
                      </div>
                    ))}
                    <div className="flex flex-col">

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
                      <button
                        onClick={() => setSelectedBrands([])}
                        className="text-blue-500 mt-2"
                      >
                        Limpiar selección
                      </button>
                    </div>

                  </div>
                </Sidebar.Item>
              </Sidebar.Collapse>

              {/* Temporada */}
              <Sidebar.Collapse label="Temporada" className='shadow-md my-5'>
                <Sidebar.Item>
                  <div className="mt-4 ">
                    {temporadas.map((temporada) => (
                      <div key={temporada.idTemporada} className="flex items-center space-x-3 space-y-2 ">
                        <Checkbox
                          id={`temporada-${temporada.idTemporada}`}
                          checked={selectedSeasons.includes(temporada.idTemporada)}
                          onChange={() => handleSeasonChange(temporada.idTemporada)}
                        />
                        <Label  htmlFor={`temporada-${temporada.idTemporada}`}>
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
              <Sidebar.Collapse label="Tallas"  className='shadow-md my-5'>
                <Sidebar.Item>
                  <div className="mt-4">
                    {tallas.map((talla) => (
                      <div key={talla.idTalla} className="flex items-center space-x-3 space-y-2">
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
                      onClick={() => setFilters((prevFilters) => ({ ...prevFilters, talla: '' }))}
                      className="text-blue-500 mt-2"
                    >
                      Limpiar selección
                    </button>
                  </div>
                </Sidebar.Item>
              </Sidebar.Collapse>

              {/* Ofertas */}
              <Sidebar.Collapse label="Ofertas"  className='shadow-md my-5'>
                <Sidebar.Item>
                
<div className="mt-4">
  {Ofertas.map((Oferta) => (
    <div key={Oferta.idOferta} className="flex items-center space-x-3 space-y-2">
      <Radio
        id={`Oferta-${Oferta.idOferta}`}
        name="Oferta"
        value={Oferta.idOferta}
        checked={String(filters.oferta) === String(Oferta.idOferta)}
        onChange={() => handleOfferChange(Oferta.idOferta)}   // Cambia el estado cuando se selecciona una oferta
      />
      <Label htmlFor={`Oferta-${Oferta.idOferta}`}>{Oferta.descripcion}</Label>
    </div>
  ))}
                <button
  onClick={() => setFilters((prevFilters) => ({ ...prevFilters, oferta: '' }))}
  className="text-blue-500 mt-2"
>
  Limpiar selección
</button>
                  </div>
                </Sidebar.Item>
              </Sidebar.Collapse>

              {/* Precio Mínimo y Máximo */}
              <SidebarCollapse label="Precio"  className='shadow-md my-5'>
              <Sidebar.Item>
                <Label className="block mt-4 space-x-3 space-y-2">Precio Mínimo: ${filters.precioMin}</Label>
                <RangeSlider
                  min={0}
                  max={1000}
                  step={10}
                  value={filters.precioMin}
                  onChange={(e) => handlePriceChange(Number(e.target.value), 'precioMin')}
                />
                <Label className="block mt-4 space-x-3 space-y-2">Precio Máximo: ${filters.precioMax}</Label>
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
              </SidebarCollapse>
              

              {/* Tiendas 
              <Sidebar.Collapse label="Tiendas">
                <Sidebar.Item>
                  <div className="mt-4">
                    {Tiendas.map((tienda) => (
                      <div key={tienda.idVendedor} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tienda-${tienda.idVendedor}`}
                          checked={selectedStores.includes(tienda.idVendedor)}
                          onChange={() => handleStoreChange(tienda.idVendedor)}
                        />
                        <Label htmlFor={`tienda-${tienda.idVendedor}`}>{tienda.nom_empresa}</Label>
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
              </Sidebar.Collapse>*/}
            </Sidebar.ItemGroup>
          </Sidebar.Items>

          <button
            onClick={handleApplyFilters}
            className="bg-custom text-black py-2 mt-4 rounded hover:bg-second w-full"
          >
            Aplicar Filtros
          </button>
        </Sidebar>


        <div className="w-3/4 p-3 flex flex-col"> {/* Contenedor de productos y tabs */}
          {/* Buscador siempre visible arriba */}
          <div>
    {/* Buscador */}
    <div className="flex justify-end">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 border border-custom rounded-full focus:outline-none focus:ring-2 focus:ring-custom"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 18l6-6M4 10a6 6 0 1112 0 6 6 0 01-12 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    {/* Muestra productos filtrados */}
    <div className="product-list">
      {filteredProducts.map(product => (
        <div key={product.id} className="product-item ">
          {/* Renderiza cada producto aquí */}
          <h3>{product.nombre}</h3>
        </div>
      ))}
    </div>
  </div>


          <div className="products grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
            {currentProducts.map((producto) => (
              <div
                key={producto.idProducto}
                className="product border p-4 block rounded shadow-lg text-center"
              >
                <div className="flex justify-end">
                  <button
                    onClick={() => handleFavorite(producto.idProducto)}
                    className={`p-2 rounded flex items-center justify-center ${favoritos.some(
                      (favorito) => favorito.id === producto.idProducto
                    )
                      ? "text-red-500"
                      : "text-gray-300"
                      }`}
                    style={{ width: "40px", height: "40px" }}
                  >
                    <svg
                      className={`w-[24px] h-[64px] ${favoritos.some(
                        (favorito) => favorito.id === producto.idProducto
                      )
                        ? "text-red-500"
                        : "text-gray-800 dark:text-white"
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                    </svg>
                  </button>
                </div>
                <img
                  src={`http://localhost:3001/images/${producto.primera_foto}`}
                  alt="Producto"
                  className="w-64 h-64 object-cover mx-auto mb-6"
                />
                <Link to={`/detalleproducto/${producto.idProducto}`}>
                  <h2 className="text-xl font-semibold mb-2">
                    {producto.producto}
                  </h2>
                </Link>
                <p className="text-lg mb-4">
                  $
                  {producto.precioConDescuento !== 0
                    ? producto.precioConDescuento
                    : producto.precio}
                </p>

                {/**  <div className="flex flex-row items-center justify-center">
                  <button
                    className="p-5  bg-custom hover:bg-second"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Agregar 
                  </button>
                  <Link to={`/resumencompra`}>
                    <button className="p-5 m-1 bg-custom hover:bg-second">
                      Comprar
                    </button>
                  </Link>
                  
                </div>*/}

                <span className="text-xl mb-2">
                  {producto.tienda}
                </span>
              </div>
            ))}
          </div>


          {/* Componente de paginación */}
          <div className="text-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
              onPageChange={onPageChange}
              className="flex justify-center"
            />
          </div>
        </div>
      </div>

      <div className="">
        <Footer className="mt-auto" />
      </div>

    </div>
  );
}

export default Tienda;
