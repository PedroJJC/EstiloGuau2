import { Drawer } from "flowbite-react";
import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../Context/CartContext';
import { Link } from 'react-router-dom';


export default function ShoppingCart({ isOpen, setIsOpen }) {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, disminuirCantidad } = useContext(CartContext);
  const handleClose = () => setIsOpen(false);
  console.log(carrito)
  const subtotal = carrito.reduce((acc, producto) => acc + (Number(producto.precio) * Number(producto.cantidad)), 0);
  const descuentoTotal = carrito.reduce((acc, producto) => acc + ((Number(producto.precio) * Number(producto.cantidad) * Number(producto.porcentaje_descuento)) / 100), 0);
  const total = subtotal - descuentoTotal;
  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      position="right"
      className="bg-white w-1/4 p-4 flex flex-col h-full"
    >
      <div className="font-roboto flex flex-col flex-grow">
        {/* Título del carrito */}
        <h1 className="text-3xl font-bold text-start mt-6 mb-4">Tu carrito</h1>

        {/* Lista de productos */}
        <div className="space-y-4 flex-grow">
          {carrito.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            carrito.map((producto) => (
              <div className="flex flex-col">
                <div key={producto.idProducto + producto.talla} className="flex items-center justify-between p-4 bg-custom rounded-lg">
                  <img
                    src={`http://localhost:3001/images/${producto.foto.split(",")[0]}`} // Muestra solo la primera imagen
                    className="w-20 h-20 object-cover rounded-full"
                  />
                  <div className="flex-grow ml-4">
                    <h2 className="font-semibold text-base text-left">{producto.producto}</h2>
                    <p className="text-sm text-gray-500 text-left">Talla: {producto.talla}</p>
                    <p className="font-bold text-left">
                      ${producto.precio * producto.cantidad}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="px-2 py-1 border rounded hover:bg-second"
                      onClick={() => disminuirCantidad(producto.idProducto, producto.talla)}
                    >
                      -
                    </button>
                    <span className="px-2">{producto.cantidad}</span>
                    <button
                      className="px-2 py-1 border rounded hover:bg-second"
                      onClick={() => agregarAlCarrito(producto, producto.talla)}
                    >
                      +
                    </button>
                    <button
                      className="ml-2 px-2 py-1 border rounded hover:bg-red-500 hover:text-white"
                      onClick={() => eliminarDelCarrito(producto.idProducto, producto.talla)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>               
              </div>
            ))
          )}
 {/* Resumen de compra */}
 <div className="mt-6 p-4 bg-custom rounded-lg">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$565</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>Descuento (-20%)</span>
                    <span>-$113</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total</span>
                    <span>$467</span>
                  </div>
                </div>
                {/* Botón de pago */}
                <div className="">
                  <Link to={{ pathname: '/resumencompra', state: { carrito } }}>
                    <button className="w-full bg-black text-white mt-6 p-4 font-roboto font-bold rounded-lg hover:bg-slate-900">
                      Proceder a pago
                    </button>
                  </Link>
                </div>
        </div>
      </div>
    </Drawer>
  );
}
