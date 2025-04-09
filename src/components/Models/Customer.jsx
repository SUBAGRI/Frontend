import Pagination from '../Utils/Pagination'; // Asegúrate de importar el componente de paginación
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ModalEdit from "../Forms/ModalEditOrder";
import Swal from 'sweetalert2'
import "../../styles/Notification.css"
import api from "../../api";

//Facturas recibidas

function Customer({ facturasrec, fetchData, tableTab, clientes, productos }) {
    // Estado de la expansión de cada fila
    const [expandedRows, setExpandedRows] = useState({});
    // Estado del modal de edición
    const [isModalActive, setIsModalActive] = useState(false);

    const [selectedFactura, setSelectedFactura] = useState([])

    const [currentPage, setCurrentPage] = useState(1);

    // Número de pedidos por página
    const ordersPerPage = 15;

    
    // Calcular el índice del primer y último pedido de la página actual
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    
    // Obtener los prdocutso de la página actual
    const currentFacturasRed = facturasrec.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(indexOfFirstOrder, indexOfLastOrder);

    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString("es-ES", options);
    };

    const handleEditClick = (facturaRec) => {
        setSelectedFactura(facturaRec); // Actualizar el estado con el pedido seleccionado
        setIsModalActive(true);
    };

    // Alternar la expansión de una fila específica
    const handleRowClick = (idOrder) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idOrder]: !prev[idOrder]
        }));
    };

    // Confirmacion de eliminacion
    const handleChoice = async (facturaRec) => {
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
            handleDeleteClick(facturaRec);
        }
    };

    const handleDeleteClick = async (facturaRec) => {
        
        try {
            console.log('/api' + "/facturasRec/" + facturaRec.idOrder + '/')
                const response = await api.delete('/api' + "/facturasRec/" + facturaRec.idOrder + '/'); 
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

    return (
        <div>
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Nº Factura</th>
                        <th>Proveedor</th>
                        <th>Base imp.</th>
                        <th>IVA</th>    
                        <th>Importe IVA</th>
                        <th>IRPf</th>
                        <th>Importe IRPf</th>
                        <th>Total Fac.</th>
                    </tr>
                </thead>
                <tbody>
                    {(currentFacturasRed).map((facturaRec) => (
                        <React.Fragment key={facturaRec.idOrder}>
                            {/* Fila principal */}
                            <tr onClick={() => handleRowClick(facturaRec.idOrder)} style={{ cursor: "pointer" }}>
                                <td>{formatDate(facturaRec.fecha)}</td>
                                <td>{facturaRec.numfac}</td>
                                <td>{facturaRec.proveedor}</td>
                                <td>{facturaRec.baseimp} €</td> 
                                <td>{facturaRec.IVA} %</td>
                                <td>{facturaRec.IVAimp} €</td>
                                <td>{facturaRec.IRPf} %</td>
                                <td>{facturaRec.IRPfimp} €</td>
                                <td>{facturaRec.total} €</td>
                                <td>
                                    <button
                                        className="mr-3 fa fa-edit"
                                        style={{ color: "#FFF177" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(facturaRec);
                                        }}
                                    >
                                    </button>
                                    <button
                                            className="fa fa-trash-o"
                                            style={{ color: "#E61617" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChoice(facturaRec);
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
            closeModal={() => setIsModalActive(false)} formData={selectedFactura} tipo='facturasrec' clientes={clientes} productos={productos} fetchData={fetchData}/>}
            {/* Paginación */}
            <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={facturasrec.length}
                paginate={handlePaginate}
                activePage={currentPage}
            />
        </div>
    );
}
export default Customer;