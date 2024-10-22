import './App.css'; // Importa tus estilos
import './index.css'; // Asegúrate de que index.css existe si lo necesitas
import RoutesComponent from './routes/RoutesComponent '; // Ajusta la ruta según tu estructura
import { UserProvider } from './Context/UserContext'; // Ajusta la ruta según tu estructura
import OfflineDemoComponent from './Components/OfflineDemoComponent/OfflineDemoComponent'; // Ajusta la ruta según tu estructura

function App() {
  return (
    <div className="App">
      <UserProvider>
        <RoutesComponent />
     
      <OfflineDemoComponent />
       </UserProvider>
    </div>
  );
}

export default App;
