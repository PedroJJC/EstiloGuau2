import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const CartContext = createContext();

// Crear un provider
export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    // Cargar el carrito desde localStorage al iniciar
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    return carritoGuardado || [];
  });

  // Guardar el carrito en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, talla,  cantidad, productosOferta, productosPrecios) => {
    const nuevaCantidad = Number(producto.cantidad ?? 0) + 1;
   
  
    setCarrito((prevCarrito) => {
      
      const productoExistente = prevCarrito.find(
        (item) => item.idProducto === producto.idProducto && item.talla === talla && item.productosPrecios === productosPrecios && item.productosOferta === productosOferta
      );
      

      if (productoExistente) {
        // Si el producto ya existe, aumentar su cantidad
        return prevCarrito.map((item) =>
          item.idProducto === producto.idProducto && item.talla === talla
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prevCarrito, { ...producto, talla: talla, cantidad: cantidad }];
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