import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../Context/UserContext';
import Navbar from "../../Components/Navbar/Navbar";
import { Button, Card } from "flowbite-react";
import axios from "axios";
import { UscuponesModal } from "../../Components/ModalCupones/ModalCupones"; // Asegúrate de importar el modal aquí

export function Uscupones() {
  const { userData } = useContext(UserContext);
  const { idUsuario } = userData;
  const [cupones, setCupones] = useState([]);
  const [filter, setFilter] = useState("activos");
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCupon, setSelectedCupon] = useState(null);

  useEffect(() => {
    const fetchCupones = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/cuponesvigentes/${idUsuario}`);
        if (Array.isArray(response.data)) {
          setCupones(response.data);
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
  today.setHours(0, 0, 0, 0);

  const filteredCupones = cupones.filter((cupon) => {
    const vigencia = new Date(cupon.vigencia);
    vigencia.setHours(0, 0, 0, 0);

    if (filter === "activos") {
      return vigencia >= today && cupon.Usado === 1;
    }

    if (filter === "vencidos") {
      return vigencia < today;
    }

    if (filter === "usados") {
      return cupon.Usado === 2;
    }

    return true;
  });

  // Función para aplicar el cupón y obtener productos
  const handleAplicarCupon = async (idVendedor) => {
    try {
      const response = await axios.get(`http://localhost:3001/aplicar-cupon/${idVendedor}`); // Usamos idUsuario directamente
      if (Array.isArray(response.data)) {
        setProductos(response.data);
      } else {
        setProductos([]);
        console.error("Los productos no son un array:", response.data);
      }
      setIsModalOpen(true); // Aquí mostramos el modal con los productos
    } catch (error) {
      console.error("Error al aplicar cupón:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
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

            return (
              <Card key={cupon.idCupon} className="max-w-sm border border-gray-300 rounded-lg shadow-md relative mb-4 px-5">
                <div className={`absolute top-0 left-0 text-xs px-2 py-1 rounded-br-md ${cupon.Usado === 1 ? 'bg-green-500 text-white' : 'bg-white text-white'}`}>New</div>
                <div className="flex justify-between items-center mb-2">
                  <h5 className={`text-3xl font-bold ${cupon.Usado === 1 ? 'text-red-600' : 'text-red-600'}`}>-{cupon.cupon * 100}%</h5>
                  {cupon.Usado === 1 && (
                    <button onClick={() => handleAplicarCupon(cupon.idVendedor)} className="bg-black text-white py-2 px-5 text-sm rounded">
                      APLICAR
                    </button>
                  )}
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

      {/* Modal de productos con el cupón */}
      <UscuponesModal
        productos={productos}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
    </div>
  );
}

export default Uscupones;
