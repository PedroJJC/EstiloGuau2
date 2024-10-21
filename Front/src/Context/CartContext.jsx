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
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, disminuirCantidad }}>
      {children}
    </CartContext.Provider>
  );
};