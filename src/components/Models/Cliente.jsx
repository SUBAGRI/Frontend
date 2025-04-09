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

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedCliente, setSelectedCliente] = useState([])

    const handleEditClick = (cliente) => {
        setSelectedCliente(cliente); // Actualizar el estado con el pedido seleccionado
        setIsModalActive(true);
    };

    // Número de pedidos por página
    const ordersPerPage = 15;

    // Calcular el índice del primer y último pedido de la página actual
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    
    // Obtener los prdocutso de la página actual
    const currentClientes = clientes.sort((a, b) => new Date(a.nombre) - new Date(b.nombre)).slice(indexOfFirstOrder, indexOfLastOrder);


    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString("es-ES", options);
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
                        <th>Nombre</th>
                        <th>Cif</th>
                        <th>Direccion</th>
                        <th>Codigo Postal</th>
                        <th>Telefono</th>
                    </tr>
                </thead>
                <tbody>
                    {(currentClientes).map((cliente) => (
                        <React.Fragment key={cliente.idCliente}>
                            {/* Fila principal */}
                            <tr onClick={() => handleRowClick(cliente.idCliente)} style={{ cursor: "pointer" }}>
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
                                            handleEditClick(cliente)
                                        }}
                                    >
                                    </button>

                                </td>
                            </tr>

                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {setIsModalActive && <ModalEditCliente isActive={isModalActive}
            closeModal={() => setIsModalActive(false)} formData={selectedCliente} fetchData={fetchData} />}
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
export default Cliente;