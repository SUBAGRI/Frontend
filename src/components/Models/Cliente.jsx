import Pagination from '../Utils/Pagination'; // Asegúrate de importar el componente de paginación
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ModalEdit from "../Forms/ModalEditOrder";
import "../../styles/Notification.css"
import ModalEditCliente from '../Forms/ModalEditOrderCliente';

//Facturas recibidas

function Cliente({ clientes, fetchData, tableTab }) {
    // Estado de la expansión de cada fila
    const [expandedRows, setExpandedRows] = useState({});
    // Estado del modal de edición
    const [isModalActive, setIsModalActive] = useState(false);
    // Estado de los pedidos según su estado
    const [unfinishedOrders, setUnfinishedOrders] = useState([]);
    const [finishedOrders, setFinishedOrders] = useState([]);
    // Estados para recordar la página actual de cada pestaña 
    const [currentPageUnfinished, setCurrentPageUnfinished] = useState(1);
    const [currentPageFinished, setCurrentPageFinished] = useState(1);

    // Número de pedidos por página
    const ordersPerPage = 15;

    // Obtener pedidos actuales según la pestaña
    const currentUnfinishedOrders = unfinishedOrders.slice((currentPageUnfinished - 1) * ordersPerPage, currentPageUnfinished * ordersPerPage);
    const currentFinishedOrders = finishedOrders.slice((currentPageFinished - 1) * ordersPerPage, currentPageFinished * ordersPerPage);

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkMode, setIsDarkMode] = useState(darkModeMediaQuery.matches);

    // Filtrar los pedidos según su estado
    useEffect(() => {
        if (Array.isArray(clientes)) {
            const unfinished = clientes.filter(order => !order.finished);
            const finished = clientes.filter(order => order.finished);
            setUnfinishedOrders(unfinished);
            setFinishedOrders(finished);
        } else {
            setUnfinishedOrders([]);
            setFinishedOrders([]);
        }
    }, [clientes]);

    useEffect(() => {
        // Función de callback que se ejecuta cuando cambia la preferencia de esquema de color
        const handleColorSchemeChange = (event) => {
            setIsDarkMode(event.matches);
        };

        // Añadir el evento de escucha a darkModeMediaQuery
        darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);

        // Limpiar el evento de escucha cuando el componente se desmonte
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
        };
    }, []);


    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString("it-IT", options);
    };

    // Estado de los pedidos enviados
    const shippedStatus = {
        0: "Not shipped",
        1: "Shipped",
        2: "In shop"
    };


    // Alternar la expansión de una fila específica
    const handleRowClick = (idOrder) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idOrder]: !prev[idOrder]
        }));
    };

    // Animaciones de apertura y cierre con GSAP
    const additionalInfoRefs = useRef({});
    useLayoutEffect(() => {
        Object.keys(expandedRows).forEach((idOrder) => {
            const ref = additionalInfoRefs.current[idOrder];
            if (ref) {
                gsap.to(ref, {
                    height: expandedRows[idOrder] ? ref.scrollHeight : 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                });
            }
        });
    }, [expandedRows]);

    // Manejar el cambio de página
    const handlePaginate = (pageNumber) => {
        if (tableTab === 'unfinished') {
            setCurrentPageUnfinished(pageNumber);
        } else if (tableTab === 'finished') {
            setCurrentPageFinished(pageNumber);
        }
    };

    // Cuando se cambie de pestaña, restablecer la página actual de la pestaña
    useEffect(() => {
        if (tableTab === 'unfinished') {
            setCurrentPageUnfinished(1);
        } else if (tableTab === 'finished') {
            setCurrentPageFinished(1);
        }
    }, [tableTab]);

    return (
        <div>
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cif</th>
                        <th>Direccion</th>
                        <th>Codigo Postal</th>
                        <th>Telefono</th>
                    </tr>
                </thead>
                <tbody>
                    {(currentUnfinishedOrders).map((cliente) => (
                        <React.Fragment key={cliente.idCliente}>
                            {/* Fila principal */}
                            <tr onClick={() => handleRowClick(cliente.idOrder)} style={{ cursor: "pointer" }}>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.cif}</td>
                                <td>{cliente.direccion} </td>    
                                <td>{cliente.cp} </td>
                                <td>{cliente.tel} </td>
                                <td>
                                    <button
                                        className="mr-3 fa fa-edit"
                                        style={{ color: "#FFF177" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsModalActive(true);
                                        }}
                                    >
                                    </button>
                                    {setIsModalActive && <ModalEditCliente isActive={isModalActive}
                                        closeModal={() => setIsModalActive(false)} formData={cliente} tipo='facturasrec' />}
                                    {
                                        // Si el pedido está terminado, muestra un botón para volver a ponerlo como no terminado
                                        cliente.finished && (
                                            <button
                                                className="fa fa-undo" // Clase CSS para el ícono de deshacer (o similar)
                                                style={{ color: "#E06D5B" }} // Puedes elegir un color diferente
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChoice(cliente)
                                                }} // Llama a la función handleUnfinishedOrder al hacer clic
                                            >
                                            </button>
                                        )
                                    }
                                </td>
                            </tr>

                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={tableTab === 'unfinished' ? unfinishedOrders.length : finishedOrders.length}
                paginate={handlePaginate}
                activePage={tableTab === 'unfinished' ? currentPageUnfinished : currentPageFinished}
            />
        </div>
    );
}
export default Cliente;