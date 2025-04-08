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

    const [selectedFactura, setSelectedFactura] = useState([])
    
    const handleEditClick = (factura) => {
        setSelectedFactura(factura); // Actualizar el estado con el pedido seleccionado
        setIsModalActive(true);
    };

     // Confirmacion de eliminacion
     const handleChoice = async (order) => {
        const result = await Swal.fire({
            title: 'Eliminar una factura',
            text: "¿Estas seguro? Esta accion no puede deshacerse",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Eliminar",
        });

        if (result.isConfirmed) {
            // Lógica para manejar la confirmación
            handleDeleteClick(order);
        }
    };

    const handleDeleteClick = async (order) => {
        
        try {
                const response = await api.delete('/api' + "/orders/" + order.idOrder + '/'); 
                console.log(response)
                // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
                await Swal.fire({
                    icon: 'success',
                    title: 'Correcto',
                    text: "La factura ha sido eliminada correctamente",
                    timer: 2000, // Cierra automáticamente después de 3 segundos (3000 milisegundos)
                    timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                });
        
                } catch (error) {
                    // Muestra una notificación de error con SweetAlert2 que se cierra automáticamente después de 3 segundos
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "La factura no se ha podido modificar",
                        timer: 2000, // Cierra automáticamente después de 3 segundos
                        timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                    });
                }
        
                try {
                    await fetchData(); // Si falla esto, no rompe todo el flujo
                    console.log("fetchData ejecutado con éxito");
                } catch (fetchError) {
                    console.error("Error al ejecutar fetchData", fetchError);
                    alert("Por favor recargue la pagina para ver cambios");
                }
        
    };
    

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
                                        style={{ color: "#6A816" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(order)
                                        }}
                                    >
                                    </button>
                                    <button
                                            className="fa fa-trash-o"
                                            style={{ color: "#E61617" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChoice(order)
                                            }}
                                            >
                                    </button>
                                
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {setIsModalActive && <ModalEdit isActive={isModalActive}
            closeModal={() => setIsModalActive(false)} formData={selectedFactura} tipo='facturas' clientes={clientes} productos={productos} fetchData={fetchData}/>}
                                    
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
