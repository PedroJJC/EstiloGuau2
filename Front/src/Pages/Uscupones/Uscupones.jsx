import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../Context/UserContext';
import Navbar from "../../Components/Navbar/Navbar";
import { Button, Card } from "flowbite-react";
import axios from "axios";

export function Uscupones() {
  const { userData } = useContext(UserContext);
  const { idUsuario } = userData;
  const [cupones, setCupones] = useState([]);
  const [filter, setFilter] = useState("activos");
  let cuponClass;

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

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetea la hora a 00:00:00 para comparar solo la fecha
  
  const filteredCupones = cupones.filter((cupon) => {
    const vigencia = new Date(cupon.vigencia);
    vigencia.setHours(0, 0, 0, 0); // Resetea la hora a 00:00:00 para la comparación
  
    if (filter === "activos") {
      return vigencia >= today && cupon.Usado === 1;  
    }
  
    if (filter === "vencidos") {
      return vigencia < today; // Solo cupones que ya han vencido
    }
  
    if (filter === "usados") {
      return cupon.Usado === 2; // Asegúrate que este sea el valor correcto para "usados"
    }
  
    return true; // Si no hay filtro específico, muestra todos
  });
  

  return (
    <div className="">
      <Navbar />
      <h1 className="pt-32 px-24 text-start font-roboto font-bold text-2xl">Mis cupones</h1>  
      <div className="p-7">
        <Button.Group>
          <Button color="gray" onClick={() => setFilter("activos")}>Activos</Button>
          <Button color="gray" onClick={() => setFilter("vencidos")}>Vencidos</Button>
          <Button color="gray" onClick={() => setFilter("usados")}>Usados</Button>
        </Button.Group>
      </div>    

      <div className="flex flex-wrap justify-center gap-4"> 
  {filteredCupones.length > 0 ? (
    filteredCupones.map((cupon) => {
      const partesDescripcion = cupon.descripcion.split("  ");
      const texto1 = partesDescripcion[0];
      const texto2 = partesDescripcion[1];

      // Definir estilo de fondo según el estado del cupón
      if (cupon.Usado === 1) {
        cuponClass = "text-gray-600"; // Cupón usado
      } else if (new Date(cupon.vigencia) < today) {
        cuponClass = "text-white"; // Cupón vencido
      } else {
        cuponClass = " text-black"; // Cupón activo
      }
        



      return (
<Card key={cupon.idCupon} className={`max-w-sm border border-gray-300 rounded-lg shadow-md relative mb-4 px-5 ${cuponClass}`}>
  <div className={`absolute top-0 left-0 text-xs px-2 py-1 rounded-br-md  ${cupon.Usado === 1 ? 'bg-green-500 text-white' : 'bg-white text-white'}`}>New</div>
  <div className="flex justify-between items-center mb-2">
    <h5 className={`text-3xl font-bold ${cupon.Usado === 1 ? 'text-red-600' : 'text-red-600'}`}>-{cupon.cupon * 100}%</h5>
    <div className="text-center">
    {cupon.Usado === 1 && ( // El botón solo aparece si el cupón no ha sido usado
        <button className="bg-black text-white py-2 px-5 text-sm rounded">
          APLICAR
        </button>
      )}    </div>
  </div>
  <div className="text-sm text-gray-700 mb-2">
    <p>{texto1}</p>
    <p>{texto2}</p>
  </div>
  <div className="border-t border-dashed border-gray-300 pt-2">
    <p className="text-gray-600">• Código: {cupon.codigo}</p>
    <p className="text-gray-600">• {new Date(cupon.fechaRegistro).toLocaleDateString()} ~ {new Date(cupon.vigencia).toLocaleDateString()}</p>
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