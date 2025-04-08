import React, { useState, useEffect } from 'react';
import api from "../../api";
import Swal from 'sweetalert2';
//import "../styles/Modal.css";
import { Input } from './Input';
import { FormProvider, useForm } from 'react-hook-form'

function ModalEditCliente({ formData, closeModal, isActive, fetchData }) {
    const methods = useForm()
    const [formData2, setFormData] = useState({});
    const idCliente = formData && formData.idCliente; // Verifica si formData está definido antes de acceder a idOrder

    useEffect(() => {
        if (formData)
            setFormData(formData);
    }, [formData]); // Fetch the order data when the component mounts

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData2, [name]: inputValue });
    };

    const onSubmit = async () => {
        closeModal();
        try {
            const response = await api.put(`/api/clientes/${idCliente}/`, formData2);
            console.log("Status de la respuesta:", response.status);
            // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: "La factura ha sido modificada correctamente",
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

    return (
        <div className={`modal is-mobile dark ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head" style={{ backgroundColor: '#00D1B2' }}>
                    <p className="modal-card-title">Editar cliente/Proveedor</p>
                    <button className="delete" aria-label="close" onClick={closeModal}></button>
                </header>
                <section style={{ margin: 0 }} className="modal-card-body">
                    <FormProvider {...methods}>
                        <form onSubmit={e => e.preventDefault()} noValidate className="box p-5">
                            {/* Formulario */}
                        
                            <div className="field mb-4">
                                <Input
                                    label="Nombre"
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    value={formData2.nombre || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field mb-4">
                                <label htmlFor="Telefono" className="label is-small">
                                    Telefono
                                </label>
                                <input
                                    className='input'
                                    type="text"
                                    name="tel"
                                    placeholder="Telefono"
                                    value={formData2.tel || ''}
                                    onChange={handleChange}
                                    pattern="[0-9]*"
                                />
                            </div>

                            <div className="field mb-4">
                                <label htmlFor="Direccion" className="label is-small">
                                    Direccion
                                </label>
                                <input
                                    className='input'
                                    type="text"
                                    name="direccion"
                                    placeholder="Direccion"
                                    value={formData2.direccion || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Campos de "Pezzo" y "Costo" en el mismo div */}
                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Pezzo" className="label is-small">
                                        CIF
                                    </label>
                                    <Input
                                        className='input'
                                        type="text"
                                        name="cif"
                                        placeholder="CIF"
                                        value={formData2.cif || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Costo" className="label is-small">
                                        C.P
                                    </label>
                                    <Input
                                        className='input'
                                        placeholder="Codigo Postal"
                                        type="number"
                                        name="cp"
                                        value={formData2.cp || 0}
                                        onChange={handleChange}
                                        maxWidth={5}
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>


                </section>
                <footer className="modal-card-foot" style={{ backgroundColor: '#00D1B2' }}>
                    <div className="buttons">
                        <button type="submit" className="button is-success" onClick={onSubmit} style={{ backgroundColor: '#2c3c5b', color: 'white' }}>Guardar</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default ModalEditCliente;
