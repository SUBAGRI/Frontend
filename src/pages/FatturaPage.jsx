import React, { useState } from 'react';
import InvoiceComponent from '../templates/Fattura';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useEffect } from 'react';

function FatturaPage() {
    const { orderId } = useParams();
    const [data, setData] = useState({});
    const sitio = localStorage.getItem("Sitio");

    useEffect(() => {
        const url = sitio === "Jesi" ? "/api/orders/" : "/api/ordersen/";
        const fetchData = async () => {
            try {
                const response = await api.get(`${url}${orderId}/`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [orderId]);

    return <InvoiceComponent FormData={data} />;
}

export default FatturaPage;