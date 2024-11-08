import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const EditarProducto = () => {
  const { id } = useParams(); // Extraer el ID del producto desde la URL
  const [agregado, setAgregado] = useState(false);
  const [message, setMessage] = useState(''); // Estado para mensajes de éxito/error
  const [currentImage, setCurrentImage] = useState([]); // Estado para almacenar la URL de la imagen actual
  const [ofertas, setOfertas] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [registros, setRegistros] = useState([]); // Estado para manejar los registros de tallas
  const [producto, setProducto] = useState({
    sku: '',
    producto: '',
    Marca: '',
    precio: '',
    descripcion: '',
    foto: [],
    idOferta: '',
    fecha_ingreso: ''
  });
  const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory

  useEffect(() => {
    const obtenerOfertas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/all-ofertas');
        setOfertas(response.data);
      } catch (error) {
        console.error('Error al obtener las ofertas:', error);
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

    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/productos/${id}`);
        //console.log(response.data);
        setProducto(response.data);
        const fotos = response.data.foto.split(',');
        setCurrentImage(fotos); // Establecer la URL de la imagen actual
        setRegistros(response.data.registros || []); // Asumir que los registros vienen en el producto
      } catch (error) {
        console.error(`Error al obtener el producto con ID ${id}:`, error);
      }
    };

    obtenerOfertas();
    obtenerTallas();
    obtenerProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files;
    if (file.length > 4) {
      alert("Solo puedes seleccionar un máximo de 4 imágenes.");
      e.target.value = null; // Resetea el input si excede el límite
    } else {
      setProducto({ ...producto, foto: Array.from(file) });
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newRegistros = [...registros];
    newRegistros[index] = { ...newRegistros[index], [name]: value };
    setRegistros(newRegistros);
  };

  
  const handleSave = async (e) => {
    e.preventDefault();
    console.log("entre!")
    const formData = new FormData();
    Object.keys(producto).forEach(key => {
      if (key === 'foto' && Array.isArray(producto.foto)) {
        producto.foto.forEach((file) => {
          formData.append('foto', file);  // Agrega cada archivo con el nombre 'foto'
        });
      } else {
        formData.append(key, producto[key]);
        console.log(key,producto[key],"cecece")

      }
    });

    formData.append('registros', JSON.stringify(registros));

    try {
        const response = await axios.put(`http://localhost:3001/registros/${id}`, formData, {
        
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setAgregado(true);
        navigate('/productos');
        console.log("Registro actualizado:", response.data);
    } catch (error) {
        console.error("Error al actualizar el registro:", error);
    }

    try {
      const responseInv = await axios.put(`http://localhost:3001/inventario/${id}`, formData, {
      
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Registro actualizado:", responseInv.data);
  } catch (error) {
      console.error("Error al actualizar el registro:", error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("entre!")
    const formData = new FormData();
    Object.keys(producto).forEach(key => {
      if (key === 'foto' && Array.isArray(producto.foto)) {
        producto.foto.forEach((file) => {
          formData.append('foto', file);  // Agrega cada archivo con el nombre 'foto'
        });
      } else {
        formData.append(key, producto[key]);
      }
    });

    try {
      
      await axios.put(`http://localhost:3001/productos/${id}`, formData, {
        
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(formData);
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

  useEffect(() => {
    const obtenerRegistro = async () => {
      try {
          const response = await axios.get(`http://localhost:3001/registros/${id}`);
          //console.log('Datos obtenidos:', response.data); // Verifica los datos
          setRegistros(response.data);
      } catch (error) {
          console.error('Error al obtener el registro:', error);
      }
    };

if (id) {
    obtenerRegistro();
}
}, [id]);


  return (
    <div className="pl-72 pt-28 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
      <Navbar />
      <Sidebar />
      <div className="carrito-container mx-4 flex-1 ">
        <h2 className="pl-10 font-bold mb-5 ml-4 text-center text-4xl">Editar producto</h2>
        <p className="pl-10 font-light mb-8 ml-4 text-center text-1xl">Por favor, ingrese los datos que desea modificar.</p>
        {agregado && (
          <div className="bg-green-100 border border-green-400 text-green-700 py-5 mx-96 rounded relative mb-4" role="alert">
            <strong className="font-bold">¡Producto editado correctamente!</strong>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto grid grid-cols-1 gap-6">
         {/* Columna 1 */}
    {/* Fecha de ingreso */}
    <div className="col-span-2 mb-4">
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
      <div className="col-span-2 mb-4">
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
    <div className="col-span-2 mb-4">
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
    <div className="col-span-2 mb-4">
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
          
          {/* Tallas y precios */}      
          <table className="min-w-full bg-white border border-gray-300 mt-5">
            <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Talla</th>
                    <th className="border border-gray-300 px-4 py-2">Precio</th>
                    <th className="border border-gray-300 px-4 py-2">Oferta</th>
                    <th className="border border-gray-300 px-4 py-2">Existencias</th>
                </tr>
            </thead>
            <tbody>
                {registros.map((registro, index) => (
                    <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                            <select
                                id={`idTalla-${index}`}
                                name="idTalla"
                                value={registro.idTalla || ''}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="" disabled>Selecciona la talla</option>
                                {tallas.map((talla) => (
                                    <option key={talla.idTalla} value={talla.idTalla}>
                                        {talla.talla}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            <input
                                type="number"
                                id={`precio-${index}`}
                                name="precio"
                                value={registro.precio || ''}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                min="0"
                            />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            <select
                                id={`idOferta-${index}`}
                                name="idOferta"
                                value={registro.idOferta || ''}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="" disabled>Selecciona una oferta</option>
                                {ofertas.map((oferta) => (
                                    <option key={oferta.idOferta} value={oferta.idOferta}>
                                        {oferta.descripcion}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            <input
                                type="number"
                                id={`Existencias-${index}`}
                                name="Existencias"
                                value={registro.Existencias || ''}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </td>
                    </tr>
                ))}
                {/* Fila para agregar un nuevo registro */}
                <tr>
                    <td className="border border-gray-300 px-4 py-2">
                        <select
                            id={`idTalla-${registros.length}`}
                            name="idTalla"
                            value=""
                            onChange={(e) => handleInputChange(e, registros.length)}
                            className="w-full shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="" disabled>Selecciona la talla</option>
                            {tallas.map((talla) => (
                                <option key={talla.idTalla} value={talla.idTalla}>
                                    {talla.talla}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        <input
                            type="number"
                            id={`precio-${registros.length}`}
                            name="precio"
                            value=""
                            onChange={(e) => handleInputChange(e, registros.length)}
                            className="w-full shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            min="0"
                        />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        <select
                            id={`idOferta-${registros.length}`}
                            name="idOferta"
                            value=""
                            onChange={(e) => handleInputChange(e, registros.length)}
                            className="w-full shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="" disabled>Selecciona una oferta</option>
                            {ofertas.map((oferta) => (
                                <option key={oferta.idOferta} value={oferta.idOferta}>
                                    {oferta.descripcion}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        <input
                            type="number"
                            id={`Existencias-${registros.length}`}
                            name="Existencias"
                            value=""
                            onChange={(e) => handleInputChange(e, registros.length)}
                            className="w-full shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </td>
                </tr>
            </tbody>
        </table>


         
        </form>
        <div className="flex items-end justify-end  pl-20 space-x-3 m-3 ">
  <button
    type="submit" // Esto puede ser `button` si no estás dentro de un <form>
    onClick={handleSave} // Aquí está la llamada a handleSave
    className="bg-custom text-black px-6 py-2  rounded hover:bg-green-700"
  >
    Guardar
  </button>
  <button
        onClick={() => navigate(-1)}
        className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded focus:outline-none focus:shadow-outline"
      >
        Volver
      </button>
</div>
      </div>
      <div className="">
              <Footer />
      </div>
    </div>
  );
};

export default EditarProducto;
