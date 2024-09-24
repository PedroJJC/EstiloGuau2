import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de importar los estilos


function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine); // <- state

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast.success('Estás conectado a Internet.', {
                position: "top-left", // Puedes cambiar la posición
                autoClose: 3000, // Tiempo que permanece visible (ms)
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        };
        const handleOffline = () => {
            setIsOnline(false);
            toast.error('Estás desconectado.', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        };


        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return <ToastContainer />;

    //return (
      //  <div>
        //    {isOnline ? 'Estás conectado a Internet.' : 'Estás desconectado.'}
        //</div>
    //);
}

export default NetworkStatus;