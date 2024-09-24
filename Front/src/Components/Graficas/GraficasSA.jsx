import React, {useState,useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { UserContext } from '../../Context/UserContext';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const GraficasSA = () => {
  const { userData } = useContext(UserContext);

    const [ventasMensuales, setVentasMensuales] = useState([]);
    const [ventasSemanales, setVentasSemanales] = useState(0);
    const [ventasDiarias, setVentasDiarias] = useState(0);

    const [anioActual, setAnioActual] = useState('');
    const [mesActual, setMesActual] = useState('');

    const [fechaInicioSemana, setFechaInicioSemana] = useState(null);
    const [fechaFinSemana, setFechaFinSemana] = useState(null);

    const obtenerFechaActual = () => {
      const ahora = new Date();
      const dia = ahora.getDate();
      const mes = ahora.getMonth() + 1; // Los meses son base 0 en JavaScript
      const anio = ahora.getFullYear();
  
      // Formatear la fecha como necesario (ejemplo: DD/MM/YYYY)
      const fechaFormateada = `${dia}/${mes}/${anio}`;
  
      return fechaFormateada;
    };

        const fetchVentasMensuales = async () => {
      // Función para obtener ventas mensuales
      try {
      const response = await axios.get(`http://localhost:3001/ventas/mensuales`);
      setVentasMensuales(response.data);
      //console.log(response.data)
    } catch (error) {
      console.error('Error fetching ventas mensuales:', error);
    }
  };

    // Función para obtener ventas semanales
    const fetchVentasSemanales = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/ventas/semana`);
        setVentasSemanales(response.data[0]?.total_ventas_semana);
      } catch (error) {
        console.error('Error fetching ventas semanales:', error);
      }
    };

      // Función para obtener ventas diarias
  const fetchVentasDiarias = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/ventas/dia`);
      setVentasDiarias(response.data[0]?.total_ventas_dia || 0);
    } catch (error) {
      console.error('Error fetching ventas diarias:', error);
    }
  };

    // Llamar a las funciones al cargar el componente
    useEffect(() => {
      fetchVentasMensuales();
      fetchVentasSemanales();
      fetchVentasDiarias();
    }, []);


  
    useEffect(() => {
      const fechaActual = new Date();
      const anio = fechaActual.getFullYear();
      const mes = fechaActual.toLocaleString('default', { month: 'long' }); // Obtener nombre del mes
  
      setAnioActual(anio.toString());
      setMesActual(mes);
    }, []);

    const [productosMasVendidos, setProductosMasVendidos] = useState([]);

    useEffect(() => {
      const fetchProductosMasVendidos = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/mas-vendidos`);
          console.log('Datos recibidos:', response.data); // Verifica los datos recibidos desde la API
          
          setProductosMasVendidos(response.data);
        } catch (error) {
          console.error('Error al obtener productos más vendidos:', error);
        }
      };
    
      fetchProductosMasVendidos();
    }, []);


  useEffect(() => {
    // Calcula las fechas de inicio y fin de la semana actual
    const inicioSemana = moment().startOf('week').format('DD/MM/YYYY');
    const finSemana = moment().endOf('week').format('DD/MM/YYYY');
    
    setFechaInicioSemana(inicioSemana);
    setFechaFinSemana(finSemana);
  }, []);
  

//#region  Ganancias por mes
    const [lineData, setLineData] = useState({
      labels: [],
      datasets: [
        {
          label: 'Ganancias',
          data: [],
          fill: false,
          borderColor: 'rgba(0, 0, 0, 1)',
          tension: 0.1,
        },
      ],
    });
  
    useEffect(() => {
      const fetchGananciasMensuales = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/ganancias/mensuales`);
          const data = response.data;
          //console.log(data)
          const labels = data.map(item => `${item.mes}/${item.anio}`);
          const ganancias = data.map(item => item.total_ganancias);
  
          setLineData({
            labels: labels,
            datasets: [
              {
                ...lineData.datasets[0],
                data: ganancias,
              },
            ],
          });

          //console.log('Datos recibidos:', response.data);
        } catch (error) {
          console.error('Error fetching ganancias mensuales:', error);
        }
      };
  
      fetchGananciasMensuales();
    }, []);
  


  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Últimos 6 meses',
      },
    },
  };
  //#endregion

  return (
    <div className="container mx-auto px-32 p-4 grid grid-cols-3 gap-4">
    <h1 className="text-start text-4xl font-bold">Resumen de ganancias</h1>
    <div className="col-span-3 grid grid-cols-3 gap-4">
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h2 className="my-2 text-start text-xl font-semibold">Ventas por Mes</h2>
          <p className="m-2 text-start text-3xl font-bold">
      {ventasMensuales.length > 0 
        ? `$${ventasMensuales.reduce((total, venta) => total + venta.total_ventas, 0).toFixed(2)}`
        : '$0.00'}
    </p>          <p className="m-2 text-start text-sm text-green-700">Año: {anioActual} Mes: {mesActual} </p>
        </div>
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h2 className="my-2 text-start text-xl font-semibold">Ventas de la Semana</h2>
          <p className="m-2 text-start text-3xl font-bold">
      ${ventasSemanales ? ventasSemanales.toFixed(2) : '0.00'} {/* Verificación para evitar null */}
    </p>          <p className="text-start text-sm text-green-700">Semana del: {fechaInicioSemana && fechaFinSemana ? `${fechaInicioSemana} al ${fechaFinSemana}` : 'Cargando...'}</p>
        </div>
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h2 className="my-2 text-start text-xl font-semibold">Ventas del Día</h2>
          <p className="m-2 text-start text-3xl font-bold">
      ${ventasDiarias ? ventasDiarias.toFixed(2) : '0.00'} {/* Verificación para evitar null */}
    </p>          <p className="text-start text-sm text-green-700">Fecha: {obtenerFechaActual()}</p>
        </div>
      </div>
      <div className="col-span-2 pb-8 pl-24 pt-2 h-96 bg-custom rounded-md shadow-xl">
      <h2>Ganancias por mes</h2>
        <Line data={lineData} options={lineOptions} />
      </div>

      <div className="p-4 bg-custom rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold">Artículos más vendidos</h2>
        <div className="mt-4">
        {productosMasVendidos.map((producto, index) => (
          <div key={index} className="flex flex-row  mb-4">
            <img src={`http://localhost:3001/images/${producto.primera_foto}`}
                      alt="" className=" h-32 p-3" />
            <p className=" flex flex-col text-lg font-bold mt-2">{producto.nombre_producto}
            <span className='text-lg font-light mt-2'> {producto.descripcion}</span>
            <span className='text-lg font-light mt-2'> ${producto.precio}</span>
            </p>
            
          </div>
        ))}
        {productosMasVendidos.length === 0 && <p>No hay productos vendidos aún.</p>}
        </div>
      </div>
    
    </div>
  );
};
export default GraficasSA;
