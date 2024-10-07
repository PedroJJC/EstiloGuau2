import React, { useContext } from "react";
import { UserContext } from '../../Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Graficas from '../../Components/Graficas/Graficas';
import GraficasSA from '../../Components/Graficas/Graficas';
import FooterAdmin from '../../Components/Footer/FooterAdmin';

const Dashboard = () => {
  const { userData } = useContext(UserContext);
  const { idRol } = userData;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <div className="flex-1">
          <div className="p-0"> {/* Sin padding para ocupar todo el espacio */}
            <h2 className="font-bold mb-4 text-left text-4xl">Dashboard</h2>
            <p className="font-light mb-4 text-left text-xl">Resumen de las gráficas</p>
            {idRol === 3 ? (
              <div className="w-full h-full"> {/* Ocupa toda la pantalla */}
                <GraficasSA />
              </div>
            ) : idRol === 2 ? (
              <div className="w-full h-full"> {/* Ocupa toda la pantalla */}
                <Graficas />
              </div>
            ) : (
              <div className="text-left text-gray-500">No tienes acceso a esta vista.</div>
            )}
          </div>
        </div>
      </div>
      <div className="m-0"> {/* Sin margen para el pie de página */}
        <FooterAdmin />
      </div>
    </div>
  );
};

export default Dashboard;
