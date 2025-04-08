import Pagination from '../Utils/Pagination'; // Asegúrate de importar el componente de paginación
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ModalEdit from "../Forms/ModalEditOrder";
import "../../styles/Notification.css"

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
    const currentFacturasRed = facturasrec.slice(indexOfFirstOrder, indexOfLastOrder);

    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString("it-IT", options);
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
                                            setIsModalActive(true);
                                            handleEditClick(facturaRec)
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