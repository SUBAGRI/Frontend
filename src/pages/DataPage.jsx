import React from "react";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import api from '../api';
import Data from "../templates/Data";
import { Link } from 'react-router-dom';

function DataPage() {

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

    return (
        <Data FormData={data} />
    );
}

export default DataPage;