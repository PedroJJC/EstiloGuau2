import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Crear el contexto
export const CartContext = createContext();

const notify = () => {
   

};

// Crear un provider
export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    // Cargar el carrito desde localStorage al iniciar
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    return carritoGuardado || [];
  });

  // Guardar el carrito en localStorage
  useEffect(() => {
    console.log("cvdcscfed",JSON.stringify(carrito))
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, talla,  cantidad, precioSeleccionado,precioOriginal, productosOferta ) => {
    const nuevaCantidad = Number(producto.cantidad ?? 0) + 1;
   
  
    setCarrito((prevCarrito) => {
      
      const productoExistente = prevCarrito.find(
        (item) => item.idProducto === producto.idProducto && item.talla === talla && item.precioSeleccionado === precioSeleccionado && item.precioOriginal === precioOriginal&& item.productosOferta === productosOferta
      );
      

      if (productoExistente) {
        // Si el producto ya existe, aumentar su cantidad
        return prevCarrito.map((item) =>
          item.idProducto === producto.idProducto && item.talla === talla
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
        );
      } else {
        toast.success('Producto agregado al carrito!',{
           position: "top-center",
           autoClose: 900, // Tiempo que permanece visible (ms)
           hideProgressBar: true,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
        })    
        // Si no existe, agregarlo con cantidad 1
        return [...prevCarrito, { ...producto, talla: talla, cantidad: cantidad, precioSeleccionado : precioSeleccionado, precioOriginal : precioOriginal, productosOferta : productosOferta }];
      }
      
    });
  };

  const eliminarDelCarrito = (idProducto, talla) => {
    setCarrito((prevCarrito) => prevCarrito.filter((producto) => producto.idProducto !== idProducto  || producto.talla !== talla ));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const disminuirCantidad = (idProducto, talla) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find((item) => item.idProducto === idProducto);
      if (!productoExistente) return prevCarrito;

      if (productoExistente.cantidad === 1) {
        // Si la cantidad es 1, eliminar el producto
        return prevCarrito.filter((item) => item.idProducto !== idProducto);
      }

      return prevCarrito.map((item) =>
        item.idProducto === idProducto && item.talla === talla
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
    });
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, disminuirCantidad }}>
      {children}
    </CartContext.Provider>
  );
};