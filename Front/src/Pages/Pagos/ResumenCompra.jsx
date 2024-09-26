import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { Accordion } from "flowbite-react";
import Footers from '../../Components/Footer/Footer';

const ResumenPago = () => {

  return (
    <div className="w-full">
       <div className="w-full px-52 mt-28 font-roboto ">
      <Navbar />
      <div className="shadow-md shadow-slate-300 ">
        <h1 className="m-5 font-bold text-4xl text-center">Resumen de Comprar</h1>

        <div className="shadow-md shadow-slate-200 pb-2 ">
          {/* Información de facturación */}
          <section className="mb-6 m-5">
            <h2 className="text-3xl font-bold flex justify-between items-center my-5">
              <span>1. Tus datos</span>
              <button className="text-blue-600 hover:underline">Editar</button>
            </h2>
            <div className="mx-10">
              <p>Miriam Dzul</p>
              <p>miri@gmail.com</p>
              <p>?</p>
            </div>


          </section>
        </div>

        <div className="shadow-md shadow-slate-200 pb-2">
          {/* Resumen del pedido */}
          <section className="mb-6 m-5">
            <h2 className="text-3xl font-bold flex justify-between items-center my-5">2. Resumen de compra</h2>
            <div className="mx-10">
              <ul className="space-y-2">
                <li className="flex justify-between items-center py-4 border-b border-gray-300">
                  <div className="flex items-center justify-end w-full">
                    <input
                      type="text"
                      placeholder="Ingresa tu cupón de descuento"
                      className="border rounded-lg p-2 w-1/4 mr-4"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                      Aplicar
                    </button>
                  </div>
                </li>

                <li className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$6,592.00</span>
                </li>
                <li className="flex justify-between">
                  <span>Total descuento</span>
                  <span>-$299.00</span>
                </li>
                <li className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$7,191.00</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div className="shadow-md shadow-slate-200 pb-2">
        <section className="mb-6 m-5">
            <h2 className="text-3xl font-bold flex justify-between items-center my-5">3. Metodo de pago</h2>
            {/* Metodos de pago */}
            <Accordion collapseAll className='shadow-md shadow-slate-200'>
              <Accordion.Panel>
                <Accordion.Title>OpenPay</Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons,
                    dropdowns, modals, navbars, and more.
                  </p>                                  
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
                <Accordion.Title>Mercado pago</Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    Flowbite is first conceptualized and designed using the Figma software so everything you see in the library
                    has a design equivalent in our Figma file.
                  </p>                 
                </Accordion.Content>
              </Accordion.Panel>             
            </Accordion>
          </section>
        </div>
      </div>
      
    </div>
    <Footers/>
    </div>
   
  );
};
export default ResumenPago;