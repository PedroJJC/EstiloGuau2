import './App.css'; // Importa tus estilos
import { CartProvider } from './Context/CartContext';
import './index.css'; // Asegúrate de que index.css existe si lo necesitas
import RoutesComponent from './routes/RoutesComponent '; // Ajusta la ruta según tu estructura
import { UserProvider } from './Context/UserContext'; // Ajusta la ruta según tu estructura
import OfflineDemoComponent from './Components/OfflineDemoComponent/OfflineDemoComponent'; // Ajusta la ruta según tu estructura
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <CartProvider>
      <UserProvider>
        <RoutesComponent />
     
      <OfflineDemoComponent />
       </UserProvider>
       </CartProvider>
    </div>
  );
}

export default App;
