import React, { useState, useEffect  } from 'react';
import Navbar from "../../Components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';


function Tienda() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filterMode, setFilterMode] = useState(null);
  const navigate = useNavigate();

  // Obtener los productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos'); // Reemplaza con tu URL de API
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [])

  const handleBuy = (product) => {
    alert(`Has comprado ${product.name} por $${product.price}`);
  };

  const handleFavorite = (idProducto) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(idProducto)
        ? prevFavorites.filter((id) => id !== idProducto)
        : [...prevFavorites, idProducto]
    );
  };

  const handleFilter = () => {
    setFilterMode(filterMode === 'filter' ? null : 'filter');
  };

  const handleSort = () => {
    setFilterMode(filterMode === 'sort' ? null : 'sort');
  };

  const handleProductClick = (idProducto) => {
    navigate(`/Producto/${idProducto}`);
  };

  return (
   <section>
     <div className="w-full pt-10 Store flex flex-col items-center min-h-screen px-8">
      <Navbar />
      <header className="w-full mt-12">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold"></h1>
        </div>
      </header>
      <div className="flex justify-center items-start w-full flex-1 mt-8">
        <div className="flex flex-col items-start p-4 mr-4">
         {/** <button
            onClick={handleFilter}
            className={`py-2 px-4 rounded mb-2 ${filterMode === 'filter' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            Filtrar
          </button>
          <button
            onClick={handleSort}
            className={`py-2 px-4 rounded ${filterMode === 'sort' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            Ordenar
          </button>*/} 
        </div>
        <div className="products flex flex-wrap justify-center gap-8 w-full p-4">
          {products.map((product) => (
            <div key={product.id} className="product border p-4 rounded shadow-lg text-center">
              <img 
               src={`http://localhost:3001/images/${product.foto}`} 
               alt="Producto" 
              className="w-64 mx-auto mb-6"               
              />
              <Link to={`/detalleproducto/${product.idProducto}`}>
              <h2 className="text-xl font-semibold mb-2">{product.descripcion}</h2>
              </Link>
              <p className="text-lg mb-4">${product.precio.toFixed(2)}</p>
              <div className="flex justify-between items-center">
             
              
              <Link to={`/detalleproducto/${product.idProducto}`}>
                <button 
                  onClick={() => handleProductClick(product.idProducto)}
                  className="bg-custom text-black py-2 px-4 rounded hover:bg-second"
                >
                  Agregar al carrito
                </button>
              </Link>

                <button 
                  onClick={() => handleFavorite(product.idProducto)} 
                  className={`p-2 rounded flex items-center justify-center ${favorites.includes(product.idProducto) ? 'text-red-500' : 'text-gray-300'}`}
                  style={{ width: '40px', height: '40px' }}
                >
                  <svg
                    className={`w-[24px] h-[24px] ${favorites.includes(product.idProducto) ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      
      <div className="text-center mt-8">
        {/* Otros contenidos */}
      </div>
      
    </div>
    <Footer/>
   </section>
     

  );
}

export default Tienda;
