import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaChartBar, FaBox } from 'react-icons/fa';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {ChartPieIcon, DocumentCheckIcon, ShoppingBagIcon, UserIcon, ReceiptPercentIcon, TicketIcon } from '@heroicons/react/24/solid';
import { } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`pt-32 h-screen fixed top-0 left-0 bg-white text-black shadow-lg flex flex-col transition-transform duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
        <div className={`flex items-center justify-center h-20 border-b border-gray-700 ${isOpen ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-bold font-roboto">Panel Administrador</h2>
        </div>
        <ul className="flex-1 space-y-2">
           
           <li className="flex items-center p-2 rounded-lg hover:bg-custom">
            <ChartPieIcon className="w-8" />
            {isOpen && <Link to="/dashboard" className="font-roboto text-medium block w-full">Dashboard</Link>}
          </li>
          <li className="flex items-center p-2 rounded-lg hover:bg-custom">
            <DocumentCheckIcon className="w-8" />
            {isOpen && <Link to="/compras" className="font-roboto text-medium block w-full">Pedidos</Link>}
          </li>
         
          <li className="flex items-center p-2 rounded-lg hover:bg-custom">
            <ShoppingBagIcon className="w-8" />
            {isOpen && <Link to="/productos" className="font-roboto text-medium block w-full">Productos</Link>}
          </li>

          <li className="flex items-center p-2 rounded-lg hover:bg-custom">
            <UserIcon className="w-8" />
            {isOpen && <Link to="/productos" className="font-roboto text-medium block w-full">Usuarios</Link>}
          </li>

          <li className="flex items-center p-2 rounded-lg hover:bg-custom">
            <ReceiptPercentIcon className="w-8" />
            {isOpen && <Link to="/productos" className="font-roboto text-medium block w-full">Ofertas</Link>}
          </li>

          <li className="flex items-center p-2 rounded-lg hover:bg-custom">
            <TicketIcon className="w-8" />
            {isOpen && <Link to="/productos" className="font-roboto text-medium block w-full">Cupones</Link>}
          </li>
        </ul>
        {/* Aquí puedes agregar más elementos del sidebar según tu aplicación */}
      </div>

      <button
        onClick={toggleSidebar}
        className={`fixed top-1/2 left-${isOpen ? '64' : '16'} transform -translate-y-1/2 text-black p-2 rounded-full shadow-lg hover:bg-custom focus:outline-none`}
      >
        {isOpen ? <MdChevronRight className="h-6 w-6" /> : <MdChevronLeft className="h-6 w-6" />}
      </button>
    </>
  );
};

export default Sidebar;
