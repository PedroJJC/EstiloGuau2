import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { Button, Card } from "flowbite-react";

export function Uscupones() {
  return (
    <div className="">
    <Navbar/>
    <h1 className="p-32 text-start font-roboto font-bold ">Mis cupones</h1>
    <div className="flex flex-col items-center">
      
    <Card className="max-w-sm border border-gray-300 p-4 rounded-lg shadow-md relative">
  <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-br-md">New</div>
  <div className="flex justify-between items-center mb-2">
    <h5 className="text-2xl font-bold text-red-600">-20%</h5>
    <div className="text-center">
      <button className="bg-black text-white py-1 px-3 text-sm rounded">APLICAR</button>
      <p className="text-xs text-gray-600 mt-1">Expira en <span className="text-red-600">31:46:37</span></p>
    </div>
  </div>
  <div className="text-sm text-gray-700 mb-2">
    <p>Superior a $MXN2,499</p>
    <p>Máximo $MXN1,099 de DTO.</p>
  </div>
  <div className="border-t border-dashed border-gray-300 pt-2">
    <p className="text-gray-600">• Código: 20MX2499Q1014</p>
    <p className="text-gray-600">• 14/10/2024 00:00 ~ 18/10/2024 00:00</p>
    <p className="text-gray-600">• Para productos seleccionados de envío Internacional</p>
  </div>
</Card>

    </div>

    </div>

  );
};

export default Uscupones;



