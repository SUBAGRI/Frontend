import Pagination from '../Utils/Pagination'; // Asegúrate de importar el componente de paginación
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ModalEdit from "../Forms/ModalEditOrder";
import "../../styles/Notification.css"
import ModalEditCliente from '../Forms/ModalEditOrderCliente';

//Facturas recibidas

function Producto({ productos, fetchData, tableTab }) {
    // Estado de la expansión de cada fila
    const [expandedRows, setExpandedRows] = useState({});
    // Estados para recordar la página actual de cada pestaña 
    const [currentPage, setCurrentPage] = useState(1);

    // Número de pedidos por página
    const ordersPerPage = 15;

    // Calcular el índice del primer y último pedido de la página actual
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    // Obtener los prdocutso de la página actual
    const currentProducts = productos.sort((a, b) => new Date(a.codigo) - new Date(b.codigo)).slice(indexOfFirstOrder, indexOfLastOrder);

    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString("it-IT", options);
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
        setCurrentPage(pageNumber);
    };

    // Cuando se cambie de pestaña, restablecer la página actual de la pestaña
    useEffect(() => {
        setCurrentPage(1);
    }, [tableTab]); 

    return (
        <div>
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {(currentProducts).map((producto) => (
                        <React.Fragment key={producto.codigo}>
                            {/* Fila principal */}
                            <tr onClick={() => handleRowClick(producto.codigo)} style={{ cursor: "pointer" }}>
                                <td>{producto.codigo}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.tipo} </td>    
                            </tr>

                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={productos.length}
                paginate={handlePaginate}
                activePage={currentPage}
            />
        </div>
    );
}
export default Producto;