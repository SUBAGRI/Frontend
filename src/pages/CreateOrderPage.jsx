import { useState, useEffect, React } from 'react';
import Form from '../components/Forms/CreateOrder';
import FormOrderCliente from '../components/Forms/CreateOrderCliente'
import api from '../api'

function CreateOrder( {tipo} ) {

    const [clientes, setclientes] = useState([]);
    const [originalClientes, setOriginalclientes] = useState([]);

    const fetchData = () => {
        api.get("api/clientes/")
            .then((res) => {
                setclientes(res.data);
                setOriginalclientes(res.data);
            })
            .catch(() => {
                
            });
    };

     useEffect(() => {
            fetchData();
        }, []);

        return (
            <>
                {tipo === "facturas" || tipo === "recibidas" ? (
                    <Form tipo={tipo} clientes={clientes} />
                ) : (
                    <FormOrderCliente />
                )}
            </>
        );
}
export default CreateOrder;
