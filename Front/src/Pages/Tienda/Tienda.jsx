import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import Navbar from "../../Components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import { Pagination, Checkbox, Label, Radio, Sidebar, RangeSlider } from "flowbite-react";
import axios from 'axios';


function Tienda() {
  const { userData } = useContext(UserContext);
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
        setProducts(data);
        //console.log(data)
        setFilteredProducts(data);

        // Cargar marcas únicas y ordenarlas alfabéticamente
        const uniqueBrands = [...new Set(data.map(product => product.Marca))].sort();
        setBrands(uniqueBrands);  // Guardar las marcas en el estado, ordenadas alfabéticamente
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
        const favoritos = response.data.map(fav => fav.idProducto);
        setFavorites(favoritos);
      } catch (error) {
        console.error('Error al obtener los favoritos:', error);
      }
    }
  };

  fetchFavorites();
}, [idUsuario]);


const [carrito, setCarrito] = useState(() => {
  // Cargar el carrito desde localStorage al iniciar
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
  return carritoGuardado || [];
});

    // Guardar el carrito en localStorage
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (producto) => {
        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.idProducto === producto.idProducto);

            if (productoExistente) {
                // Si el producto ya existe, aumentar su cantidad
                return prevCarrito.map((item) =>
                    item.idProducto === producto.idProducto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                // Si no existe, agregarlo con cantidad 1
                return [...prevCarrito, { ...producto, cantidad: 1 }];
            }
        });
    };

    const eliminarDelCarrito = (idProducto) => {
        setCarrito((prevCarrito) => prevCarrito.filter((producto) => producto.idProducto !== idProducto));
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    const disminuirCantidad = (idProducto) => {
        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.idProducto === idProducto);
            if (!productoExistente) return prevCarrito;

            if (productoExistente.cantidad === 1) {
                // Si la cantidad es 1, eliminar el producto
                return prevCarrito.filter((item) => item.idProducto !== idProducto);
            }

            return prevCarrito.map((item) =>
                item.idProducto === idProducto
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            );
        });
    };

  return (
    <section>
      <div className="w-full pt-10 Store flex flex-col items-center min-h-screen">
        <Navbar carrito={carrito} eliminarDelCarrito={eliminarDelCarrito} agregarAlCarrito={agregarAlCarrito} vaciarCarrito={vaciarCarrito} disminuirCantidad={disminuirCantidad}/>
        <header className="w-full">
          <div className="flex justify-between items-center p-4">
          </div>
        </header>
        <div className="flex justify-center items-start w-full flex-1 mt-8">
          {/* Filtros a la izquierda */}
          <div className="flex flex-col">
            <Sidebar className='w-1/9'>
              <h1 className="font-bold text-3xl mb-8">Filtros</h1>
              <Sidebar.Items >
                <Sidebar.ItemGroup >
                  {/*Marca*/}
                  <Sidebar.Collapse label="Marca">
                    <Sidebar.Item>
                      <div className="p-4">
                        <div className="flex flex-col space-y-2">
                          {/* Barra de búsqueda */}
                          <input
                            type="text"
                            placeholder="Buscar marca"
                            value={searchBrand}
                            onChange={(e) => setSearchBrand(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                          />

                          {/* Renderizar la lista de marcas como checkboxes */}
                          {displayedBrands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                              <Checkbox
                                id={brand}
                                value={brand}
                                checked={selectedBrands.includes(brand)} // Verificar si está seleccionada
                                onChange={() => handleBrandChange(brand)} // Actualizar estado al cambiar selección
                              />
                              <Label htmlFor={brand}>{brand}</Label>
                            </div>
                          ))}

                          {/* Botón para mostrar todas las marcas */}
                          {!showAllBrands && filteredBrands.length > 10 && (
                            <button
                              className="text-blue-500 mt-2"
                              onClick={() => setShowAllBrands(true)} // Mostrar todas las marcas al hacer click
                            >
                              Ver todas las marcas
                            </button>
                          )}

                          {/* Botón para ocultar las marcas si están todas visibles */}
                          {showAllBrands && (
                            <button
                              className="text-blue-500 mt-2"
                              onClick={() => setShowAllBrands(false)} // Volver a mostrar solo las primeras 10
                            >
                              Ver menos
                            </button>
                          )}
                        </div>
                      </div>
                    </Sidebar.Item>
                  </Sidebar.Collapse>

                  {/*Temporada*/}
                  <Sidebar.Collapse label="Temporada">
                    <Sidebar.Item>
                      <div className="mt-4">
                        <Label className="block mb-2">Temporada</Label>
                        <div className="flex flex-col space-y-2">
                          {/* Renderizar las temporadas como Checkboxes */}
                          {temporadas.map((temporada) => (
                            <div key={temporada.idTemporada} className="flex items-center space-x-2">
                              <Checkbox
                                id={`temporada-${temporada.idTemporada}`}
                                checked={selectedSeasons.includes(temporada.idTemporada)} // Verificar si está seleccionada
                                onChange={() => handleSeasonChange(temporada.idTemporada)} // Actualizar estado al cambiar selección
                              />
                              <Label htmlFor={`temporada-${temporada.idTemporada}`}>
                                {temporada.nombre}
                              </Label>
                            </div>
                          ))}

                          {/* Botón para limpiar la selección (opcional) */}
                          <button
                            onClick={() => {
                              setSelectedSeasons([]); // Limpiar selección de temporadas
                              setFilters(prev => ({ ...prev, temporada: '' })); // Restablecer filtro
                            }}
                            className="text-blue-500 mt-2"
                          >
                            Limpiar selección
                          </button>
                        </div>
                      </div>
                    </Sidebar.Item>
                  </Sidebar.Collapse>

                  {/*Tallas*/}
                  <Sidebar.Collapse label="Tallas">
                    <Sidebar.Item>
                      <div className="mt-4">
                        <Label className="block mb-2">Talla</Label>
                        <div className="flex flex-col space-y-2">
                          {/* Renderizar las tallas como Radio Buttons */}
                          {tallas.map((talla) => (
                            <div key={talla.idTalla} className="flex items-center space-x-2">
                              <Radio
                                id={`talla-${talla.idTalla}`}
                                name="talla"
                                value={talla.idTalla}
                                checked={filters.talla === String(talla.idTalla)}  // Verificar si está seleccionada
                                onChange={handleFilterChange}  // Actualizar estado al cambiar selección
                              />
                              <Label htmlFor={`talla-${talla.idTalla}`}>
                                {talla.talla}
                              </Label>
                            </div>
                          ))}

                          {/* Botón para limpiar la selección de tallas */}
                          <button
                            onClick={() => setFilters({ talla: '' })}
                            className="text-blue-500 mt-2"
                          >
                            Limpiar selección
                          </button>
                        </div>
                      </div>
                    </Sidebar.Item>
                  </Sidebar.Collapse>

                  {/*Precio Min*/}
                  <Sidebar.Item>
                    <div>
                      <div className="mt-4">
                        <Label className="block mb-2">Precio Mínimo: ${filters.precioMin}</Label>
                        <RangeSlider
                          id="precioMin"
                          min={0}
                          max={1000}
                          step={10}
                          value={filters.precioMin}
                          onChange={(e) => handlePriceChange(Number(e.target.value), 'precioMin')}
                        />
                      </div>
                    </div>
                  </Sidebar.Item>

                  {/*Precio Max*/}
                  <Sidebar.Item>
                    <div className="mt-4">
                      <Label className="block mb-2">Precio Máximo: ${filters.precioMax}</Label>
                      <RangeSlider
                        id="precioMax"
                        min={filters.precioMin}  // Asegura que el valor máximo sea mayor que el mínimo
                        max={1000}
                        step={10}
                        value={filters.precioMax}
                        disabled={filters.precioMin > filters.precioMax} // Deshabilitar si el mínimo es mayor que el máximo
                        onChange={(e) => handlePriceChange(Number(e.target.value), 'precioMax')}
                      />
                    </div>
                    <button
                      onClick={() => setFilters({ precioMin: 0, precioMax: 1000 })}
                      className="text-blue-500 mt-4"
                    >
                      Restablecer Precios
                    </button>
                  </Sidebar.Item>

                  {/*Tiendas*/}
                  <Sidebar.Collapse label="Tiendas">
                    <Sidebar.Item>
                      <div className="mt-4">
                        <label className="block mb-2">Tienda</label>
                        <div className="flex flex-col space-y-2">
                          {/* Renderizar las tiendas como Checkboxes */}
                          {Tiendas.map((tienda) => (
                            <div key={tienda.idUsuario} className="flex items-center space-x-2">
                              <Checkbox
                                id={`tienda-${tienda.idUsuario}`}
                                checked={selectedStores.includes(tienda.idUsuario)} // Verificar si está seleccionada
                                onChange={() => handleStoreChange(tienda.idUsuario)} // Actualizar estado al cambiar selección
                              />
                              <Label htmlFor={`tienda-${tienda.idUsuario}`}>
                                {tienda.nombre}
                              </Label>
                            </div>
                          ))}

                          {/* Botón para limpiar la selección (opcional) */}
                          <button
                            onClick={() => {
                              setSelectedStores([]); // Limpiar selección de tiendas
                              setFilters(prev => ({ ...prev, tienda: '' })); // Restablecer filtro
                            }}
                            className="text-blue-500 mt-2"
                          >
                            Limpiar selección
                          </button>
                        </div>
                      </div>
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                </Sidebar.ItemGroup>

              </Sidebar.Items>
              {/* Botón para aplicar filtros */}
              <button
                onClick={handleApplyFilters}
                className="bg-custom text-black py-2 mt-4 rounded hover:bg-second w-full"
              >
                Aplicar Filtros
              </button>
            </Sidebar>
          </div>


          {/* Productos a la derecha */}
          <div className="products grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 w-3/4">
            {currentProducts.map((producto) => (
              <div key={producto.idProducto} className="product border p-4 rounded shadow-lg text-center">
                <img
                  src={`http://localhost:3001/images/${producto.primera_foto}`}
                  alt="Producto"
                  className="w-64 h-64 object-cover mx-auto mb-6"
                />
                <Link to={`/detalleproducto/${producto.idProducto}`}>
                  <h2 className="text-xl font-semibold mb-2">{producto.producto}</h2>
                </Link>
                <p className="text-lg mb-4">${producto.precio.toFixed(2)}</p>

                {/** BOTONES */}
                <div className="flex flex-row items-center">
                  <div>
                    <button
                      className="p-1 m-1 bg-custom hover:bg-second"
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                  <div className="">
                    <Link to="/resumencompra">
                    <button
                      className="p-5 m-1 bg-custom hover:bg-second"
                    >
                      Comprar
                    </button>
                    </Link>
                    
                  </div>
                  <button
  onClick={() => handleFavorite(producto.idProducto)}
  className={`p-2 rounded flex items-center justify-center ${
    favoritos.some(favorito => favorito.id === producto.idProducto) ? 'text-red-500' : 'text-gray-300'
  }`}
  style={{ width: '40px', height: '40px' }}
>
  <svg
    className={`w-[24px] h-[24px] ${
      favoritos.some(favorito => favorito.id === producto.idProducto) ? 'text-red-500' : 'text-gray-800 dark:text-white'
    }`}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
  </svg>
</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Componente de paginación de Flowbite */}
        <div className="text-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
            onPageChange={onPageChange}
            className="flex justify-center"
          />
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default Tienda;
