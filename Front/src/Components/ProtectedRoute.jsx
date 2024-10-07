import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { userData } = useContext(UserContext);
    const { idRol } = userData;

    return (idRol && (idRol === 2 || idRol === 3)) ? children : <Navigate to="/Login" />;
};

export default ProtectedRoute;
