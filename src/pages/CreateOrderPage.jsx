import { useState, useEffect, React } from 'react';
import Form from '../components/Forms/CreateOrder';
import FormOrderCliente from '../components/Forms/CreateOrderCliente'
import FormProduct from '../components/Forms/CreateProduct'
import api from '../api'

function CreateOrder( {tipo} ) {

    const [clientes, setclientes] = useState([]);
    const [productos, setProductos] = useState([]);

    const fetchData = () => {
        api.get("api/clientes/")
            .then((res) => {
                setclientes(res.data);
                setOriginalclientes(res.data);
            })
            .catch(() => {
                
            });
    };

    const fetchDataProductos = () => {
        api.get("api/codigoProducto/")
            .then((res) => {
                setProductos(res.data);
            })
            .catch(() => {

            });
        }

     useEffect(() => {
            fetchData();
            fetchDataProductos();
        }, []);

        return (
            <>{tipo === "facturas" || tipo === "recibidas" ? (
                <Form tipo={tipo} clientes={clientes} productos={productos} />
            ) : tipo === "clientes" ? (
                <FormOrderCliente />
            ) : (
                <FormProduct />
            )}
            </>
        );
}
export default CreateOrder;
