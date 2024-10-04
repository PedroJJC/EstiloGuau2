import { Drawer } from "flowbite-react";
import React, { useState } from 'react';

export default function ShoppingCart({ isOpen, setIsOpen }) {
  const handleClose = () => setIsOpen(false);

    const [carrito, setCarrito] = useState(() => {
        const storedCarrito = localStorage.getItem('carrito');
        return storedCarrito ? JSON.parse(storedCarrito) : [];
    });


  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      position="right"
      className="bg-white w-96 p-4"
    >
      <div className="font-roboto">
        {/* Título del carrito */}
        <h1 className="text-3xl font-bold text-start mt-6 mb-4">Tu carrito</h1>

        {/* Lista de productos */}
        <div className="space-y-4">

          {carrito.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                carrito.map((producto) => (

                  <div className="flex items-center justify-between p-4 bg-custom rounded-lg">
                  <img
                    src="/path-to-dog-pants-image.jpg"
                    alt="Pantalones vaqueros ajustables para perros"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow ml-4">
                    <h2 className="font-semibold text-base text-left">{producto.producto}</h2>
                    <p className="text-sm text-gray-500 text-left">Size: Large</p>
                    <p className="font-bold text-left">${producto.precio.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button className="px-2 py-1 border rounded hover:bg-second">-</button>
                    <span className="px-2">{producto.cantidad}</span>
                    <button className="px-2 py-1 border rounded hover:bg-second">+</button>
                  </div>
                </div>

                ))
            )}
        </div>

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
        <button className="w-full mt-6 bg-black text-white py-2 rounded-lg font-semibold hover:bg-second hover:text-black hover:font-semibold hover:shadow-lg hover:shadow-slate-300 hover:border-black">
          Proceder a pago
        </button>
      </div>
    </Drawer>
  );
}
