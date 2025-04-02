import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Home/Header";
import useErrorAndLogout from "../components/Utils/ErrorBd";
import { Link } from "react-router-dom";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [originalOrders, setOriginalOrders] = useState([]);
    const [facturasRec, setFacturasRec] = useState([]);
    const [originalFacturasRec, setOriginalFacturasRec] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [originalClientes, setOriginalClientes] = useState([]);

    // Importa y usa el custom hook `useErrorAndLogout`
    const showErrorAndLogout = useErrorAndLogout();

    // Función para obtener datos de la API
    const fetchData = () => {
        api.get("api/orders/")
            .then((res) => {
                setOrders(res.data);
                setOriginalOrders(res.data);
            })
            .catch(() => {
                // Llama a `showErrorAndLogout` si ocurre un error
                showErrorAndLogout();
            });
    };

    const fetchDataFactRec = () => {
        api.get("api/facturasRec/")
            .then((res) => {
                setFacturasRec(res.data);
                setOriginalFacturasRec(res.data);
            })
            .catch(() => {
                // Llama a `showErrorAndLogout` si ocurre un error
                showErrorAndLogout();
            });
    }

    const fetchDataClientes = () => {
        api.get("api/clientes/")
            .then((res) => {
                setClientes(res.data);
                setOriginalClientes(res.data);
            })
            .catch(() => {
                showErrorAndLogout();
            })
    }

    // Carga los datos iniciales
    useEffect(() => {
        fetchData();
        fetchDataFactRec();
        fetchDataClientes();
    }, []);

    return (
        <div>
            {/* Componente Header */}
            <Header orders={orders} factrec={facturasRec} originalOrders={originalOrders} originalFacturasRec={originalFacturasRec} 
            setOrders={setOrders} setFacturasRec={setFacturasRec} fetchData={fetchData} fetchDataFactRec={fetchDataFactRec} 
            clientes={clientes} originalClientes={originalClientes} setClientes={setClientes} fetchDataClientes={fetchDataClientes} />
        </div>
    );
}

export default Orders;