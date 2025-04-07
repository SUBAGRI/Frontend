import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ModalEdit from "../Forms/ModalEditOrder";
import Pagination from "../Utils/Pagination";
import Swal from 'sweetalert2'
import "../../styles/Notification.css"
import api from "../../api";

//Facturas

function Order({ orders, fetchData, tableTab, clientes, productos }) {
    // Estado de la expansión de cada fila
    const [expandedRows, setExpandedRows] = useState({});
    // Estado del modal de edición
    const [isModalActive, setIsModalActive] = useState(false);
    // Estados para recordar la página actual de cada pestaña
    const [currentPage, setCurrentPage] = useState(1);

    // Número de pedidos por página
    const ordersPerPage = 15;

    // Calcular el índice del primer y último pedido de la página actual
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    
    // Obtener los prdocutso de la página actual
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

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
        setCurrentPage(pageNumber)
    };

    // Cuando se cambie de pestaña, restablecer la página actual de la pestaña
    useEffect(() => {
        setCurrentPage(1)
    }, [tableTab]);

    const style = { verticalAlign: 'middle' };
    const divStyle = { paddingTop: '5px', cursor: 'pointer', borderBottom: '1px solid #00D1B2', paddingBottom: '5px' }

    return (
        <div>
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                    <th style={style}>Fecha</th>
                    <th style={style}>Nº Factura</th>
                    <th style={style}>Cliente</th>
                    <th style={style}>Producto</th>
                    <th style={style}>Base imp.</th>
                    <th style={style}>IVA</th>
                    <th style={style}>Importe IVA</th>
                    <th style={style}>IRPf</th>
                    <th style={style}>Importe IRPf</th>
                    <th style={style}>Total Fac.</th>
                    <th style={style}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {(currentOrders).map((order) => (
                        <React.Fragment key={order.idOrder}>
                            {/* Fila principal */}
                            <tr onClick={() => handleRowClick(order.idOrder)} style={{ cursor: "pointer" }}>
                                <td>{formatDate(order.fecha)}</td>
                                <td>{order.numfac}</td>
                                <td>{order.cliente}</td>
                                <td>{order.producto}</td>
                                <td>{order.baseimp} €</td>    
                                <td>{order.IVA} %</td>
                                <td>{order.IVAimp} €</td>
                                <td>{order.IRPf} %</td>
                                <td>{order.IRPfimp} €</td>
                                <td>{order.total} €</td>
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
                                    {setIsModalActive && <ModalEdit isActive={isModalActive}
                                        closeModal={() => setIsModalActive(false)} formData={order} tipo='facturas' clientes={clientes} productos={productos} />}
                                    
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={clientes.length}
                paginate={handlePaginate}
                activePage={currentPage}
            />
        </div>
    );
}

export default Order;
