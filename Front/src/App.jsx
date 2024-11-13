import { useEffect, useState } from "react";
import './App.css'; // Importa tus estilos
import { CartProvider } from './Context/CartContext';
import { LocationProvider  } from './Context/LocationContext';
import './index.css'; // Asegúrate de que index.css existe si lo necesitas
import RoutesComponent from './routes/RoutesComponent '; // Ajusta la ruta según tu estructura
import { UserProvider } from './Context/UserContext'; // Ajusta la ruta según tu estructura
import OfflineDemoComponent from './Components/OfflineDemoComponent/OfflineDemoComponent'; // Ajusta la ruta según tu estructura


function App() {


  return (
    <div className="App">
      <CartProvider>
        <LocationProvider>
          <UserProvider>
            <RoutesComponent />
            <OfflineDemoComponent />
          </UserProvider>
        </LocationProvider>
      </CartProvider>
    </div>
  );
}
export default App;
