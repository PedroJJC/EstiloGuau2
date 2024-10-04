import { React, useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import { Link } from 'react-router-dom';
import { Navbar, Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiDocumentText, HiReceiptTax, HiTicket } from "react-icons/hi";

const componente = ({ isOpen, toggleSidebar }) => {
  const { userData } = useContext(UserContext);
  const { idRol } = userData;
  return (

    <Sidebar aria-label="Sidebar with multi-level dropdown example">

      <div className="h-screen fixed mt-24 top-0 left-1 bg-white text-black shadow-2xl w-64 p-8 ">
        <h1 className="text-2xl font-bold font-roboto">Panel de admistración</h1>
        <Sidebar.Items >
          <Sidebar.ItemGroup >
            {idRol === 2 && (
              <>
                <Link to="/dashboard">
                  <Sidebar.Item href="#" icon={HiChartPie} className='hover:bg-custom mt-6'>
                    Dashboard
                  </Sidebar.Item>
                </Link>

                <Link to="/productos">
                  <Sidebar.Item icon={HiShoppingBag} className='hover:bg-custom'>
                    Productos
                  </Sidebar.Item>
                </Link>

                <Link to="/compras">
                  <Sidebar.Item icon={HiDocumentText} className='hover:bg-custom'>
                    Ventas
                  </Sidebar.Item>
                </Link>

                <Link to="/ofertas">
                  <Sidebar.Item icon={HiReceiptTax} className='hover:bg-custom'>Ofertas</Sidebar.Item>
                </Link>

                <Link to="/cupones" >
                  <Sidebar.Item icon={HiTicket} className='hover:bg-custom'>Cupones</Sidebar.Item>
                </Link>
              </>
            )}

            {/* Validación para idRol 3 */}
            {idRol === 3 && (
              <>
                <Link to="/dashboard">
                  <Sidebar.Item href="#" icon={HiChartPie} className='hover:bg-custom mt-6'>
                    Dashboard
                  </Sidebar.Item>
                </Link>

                <Link to="/productos">
                  <Sidebar.Item icon={HiShoppingBag} className='hover:bg-custom'>
                    Productos
                  </Sidebar.Item>
                </Link>

                <Link to="/compras">
                  <Sidebar.Item icon={HiDocumentText} className='hover:bg-custom'>
                    Ventas
                  </Sidebar.Item>
                </Link>

                <Link to="/ofertas">
                  <Sidebar.Item icon={HiReceiptTax} className='hover:bg-custom'>Ofertas</Sidebar.Item>
                </Link>

                <Link to="/cupones" >
                  <Sidebar.Item icon={HiTicket} className='hover:bg-custom'>Cupones</Sidebar.Item>
                </Link>

                <Link to="/suscripcion" >
                  <Sidebar.Item icon={HiTicket} className='hover:bg-custom'>Suscripciones</Sidebar.Item>
                </Link>

               {/* <Link to="/suscripcion/form" >
                  <Sidebar.Item icon={HiTicket} className='hover:bg-custom'>Suscripcion Add</Sidebar.Item>
                </Link>*/}

                <Link to="/usuarios">
                  <Sidebar.Item icon={HiUser} className='hover:bg-custom'>
                    Usuarios
                  </Sidebar.Item>
                </Link>

              </>
            )}





          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </div>

    </Sidebar >

  );
};

export default componente;
