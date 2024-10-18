import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../Context/UserContext';
import Navbar from "../../Components/Navbar/Navbar";
import { Button, Card } from "flowbite-react";
import axios from "axios";

export function Uscupones() {
  const { userData } = useContext(UserContext);
  const { idUsuario } = userData;
  const [cupones, setCupones] = useState([]);

  useEffect(() => {
    const fetchCupones = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/cuponesvigentes/${idUsuario}`);
        if (Array.isArray(response.data)) {
          setCupones(response.data);
          console.log(response.data); // Verificar los datos
        } else {
          console.error("La respuesta no es un array:", response.data);
          setCupones([]); 
        }
      } catch (error) {
        console.error("Error al obtener cupones:", error);
      }
    };
  
    fetchCupones();
  }, [idUsuario]);

  return (
    <div className="">
      <Navbar />
      <h1 className="p-32 text-start font-roboto font-bold text-2xl">Mis cupones</h1>
      <div className="flex flex-wrap justify-center gap-4"> {/* Contenedor con flex y espacio entre elementos */}
        {cupones.length > 0 ? (
          cupones.map((cupon) => {
            // Dividir la descripcion en dos partes
            const partesDescripcion = cupon.descripcion.split("  "); // Divide en base a los espacios dobles
            const texto1 = partesDescripcion[0]; // "Superior a $MXN2,499"
            const texto2 = partesDescripcion[1]; // "Máximo $MXN1,099 de DTO."

            return (
              <Card key={cupon.idCupon} className="max-w-sm border border-gray-300 rounded-lg shadow-md relative mb-4 px-5">
                <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-br-md">New</div>
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-2xl font-bold text-red-600">-{cupon.cupon * 100}%</h5> {/* descuento del cupón */}
                  <div className="text-center">
                    <button className="bg-black text-white py-2 px-5 text-sm rounded">APLICAR</button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <p>{texto1}</p> {/* Texto dividido */}
                  <p>{texto2}</p> {/* Texto dividido */}
                </div>
                <div className="border-t border-dashed border-gray-300 pt-2">
                  <p className="text-gray-600">• Código: {cupon.codigo}</p>
                  <p className="text-gray-600">• {new Date(cupon.fechaRegistro).toLocaleDateString()}  ~ {new Date(cupon.vigencia).toLocaleDateString()}</p>
                </div>
              </Card>
            );
          })
        ) : (
          <p>No tienes cupones disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Uscupones;
