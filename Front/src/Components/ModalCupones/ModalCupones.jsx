import React, { useState, useEffect , useContext} from "react";
import { CartContext } from '../../Context/CartContext';


export function UscuponesModal({ productos, isModalOpen, closeModal, handleAgregarCarrito }) {
  const [timeLeft, setTimeLeft] = useState(7200); // 2 horas en segundos
  const { agregarAlCarrito } = useContext(CartContext);


  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Formato de tiempo para el temporizador
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full relative">
          
          {/* Header del Modal */}
          <div className="bg-orange-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Agrega artículos para usar un cupón de 30.00% de dto.
            </h2>
            <p className="text-lg font-bold">End in {formatTime(timeLeft)}</p>
            <button onClick={closeModal} className="text-white text-2xl">
              &times;
            </button>
          </div>

          {/* Productos */}
          <div className="p-4 overflow-x-auto flex space-x-4">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div
                  key={producto.idProducto}
                  className="flex-shrink-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
                >
                  <img
                    src={producto.foto}
                    alt={producto.producto}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-sm font-semibold">{producto.producto}</h3>
                  <p className="text-red-600 font-bold text-lg">
                    ${producto.precio}
                  </p>
                  
                  {/* Botón para agregar al carrito */}
                  <button
                    className="p-1 m-1 bg-custom hover:bg-second"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay productos disponibles</p>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Ir al pago
            </button>
          </div>
        </div>
      </div>
    )
  );
}
