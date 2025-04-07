import React, { useState, useEffect } from 'react';
import api from "../../api";
import { Input } from './Input';
import IVAInput from "./UtilsForm/InputIVA";
import { FormProvider, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import ClienteAutocomplete from './UtilsForm/clienteAutocomplete'
import ProveedorAutocomplete from './UtilsForm/proveedorAutocomplete'
import ProductoAutocomplete from './UtilsForm/productoAutocomplete';

function ModalEdit({ formData, closeModal, isActive, fetchData, tipo, clientes, productos }) {
    const methods = useForm()
    const [formData2, setFormData] = useState({});
    const orderId = formData && formData.idOrder; // Verifica si formData está definido antes de acceder a idOrder

    const sitio = localStorage.getItem("Sitio");

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkMode, setIsDarkMode] = useState(darkModeMediaQuery.matches);

    useEffect(() => {
        if (formData)
            setFormData(formData);
    }, [formData]); // Fetch the order data when the component mounts

    useEffect(() => {
        // Función de callback que se ejecuta cuando cambia la preferencia de esquema de color
        const handleColorSchemeChange = (event) => {
            setIsDarkMode(event.matches);
        };

        // Añadir el evento de escucha a darkModeMediaQuery
        darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);

        // Limpiar el evento de escucha cuando el componente se desmonte
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
        };
    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
    
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: inputValue };

            // Si el campo es numérico, eliminar ceros iniciales (excepto "0" solo)
            if (!isNaN(inputValue) && inputValue.length > 1 && inputValue.startsWith("0")) {
                let cleanedValue = inputValue.replace(/^0+/, ""); // Quita los ceros iniciales
                updatedData[name] = cleanedValue;
            }
    
            if (name === 'baseimp' || name === 'IVA') {
                updatedData.IVAimp = Math.ceil(
                    (parseFloat(updatedData.baseimp || 0) * 
                    (parseFloat(updatedData.IVA || 0) / 100)) * 100
                ) / 100;

                updatedData.total = Math.ceil(
                    (parseFloat(updatedData.baseimp || 0) + 
                    (parseFloat(updatedData.baseimp || 0) * 
                    (parseFloat(updatedData.IVA || 0) / 100))) * 100
                ) / 100;
                
            }
    
            if (name === 'baseimp' || name === 'IRPf') {
                updatedData.IRPfimp = Math.ceil(
                    (parseFloat(updatedData.baseimp || 0) * 
                    (parseFloat(updatedData.IRPf || 0) / 100)) 
                );
            }
    
            // Si el campo es "price" y empieza con '0', eliminar el primer dígito
            if (name === 'price' && value.startsWith('0')) {
                updatedData[name] = value.substring(1);
            }
    
            return updatedData;
        });
    };

    // Manejar el finalizado del pedido
    const onSubmit = async () => {
        closeModal();
        try {
            const url = tipo === 'facturas' ? "/api/orders/" : "/api/facturasRec/";
            await api.put(`${url}${orderId}/`, formData2);
            // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'successo',
                title: 'Correcto',
                text: "La factura ha sido modificada correctamente",
                timer: 2000, // Cierra automáticamente después de 3 segundos (3000 milisegundos)
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                customClass: isDarkMode ? 'swal2-dark' : '',

            });
            fetchData();

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

    };

    return (
        <div className={`modal is-mobile dark ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head" style={{ backgroundColor: '#00D1B2' }}>
                    <p className="modal-card-title">Modificar factura</p>
                    <button className="delete" aria-label="close" onClick={closeModal}></button>
                </header>
                <section style={{ margin: 0 }} className="modal-card-body">
                    <FormProvider {...methods}>
                    <form onSubmit={e => e.preventDefault()}
                            noValidate>
                            {/* Nombre del cliente */}
                            <div className="field mb-4 is-grouped" style={{justifyContent:'space-between'}}>
                            <Input
                                label="fecha"
                                type="date"
                                name="fecha"
                                placeholder="Nome"
                                value={formData2.fecha || ''}
                                onChange={handleChange}
                            />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Nª Factura"
                                    type="text"
                                    name="numfac"
                                    placeholder="Nª Factura"
                                    value={formData2.numfac || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field mb-4">
                                {tipo === 'facturas' ? (
                                    <ClienteAutocomplete formData={formData} setFormData={setFormData} clientes={clientes} />
                                ) : (
                                    <ProveedorAutocomplete formData={formData} setFormData={setFormData} clientes={clientes} />
                                )}
                            </div>
                            <div className="field mb-4">
                            <ProductoAutocomplete formData={formData} setFormData={setFormData} productos={productos} />
                            </div>
                            <div className="field mb-2 is-grouped" style={{ justifyContent: 'space-evenly' }}>
                                <div className="flex flex-col w-full gap-1">
                                    <label htmlFor="Pezzo" className="label is-small">
                                        Base Imponible
                                    </label>
                                    <Input
                                        className='input'
                                        type="number"
                                        name="baseimp"
                                        placeholder="Base imponible"
                                        value={formData2.baseimp || ""}
                                        onChange={handleChange}
                                        min={0}
                                    />
                                </div>
                                <IVAInput formData={formData2} setFormData={setFormData} handleChange2={handleChange} />
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Costo" className="label is-small">
                                        IVA importe
                                    </label>
                                    <Input
                                        className='input'
                                        placeholder="IVA importe"
                                        type="number"
                                        name="IVAimp"
                                        value={(parseFloat(formData2.baseimp || 0) * (parseFloat(formData2.IVA || 0) / 100)).toFixed(2)}
                                        readOnly
                                        min={0}
                                    />
                                </div>
                            </div>

                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Pezzo" className="label is-small">
                                        IRPf
                                    </label>
                                    <input
                                        className='input'
                                        type="number"
                                        name="IRPf"
                                        placeholder="IRPf"
                                        value={formData2.IRPf || 0}
                                        onChange={handleChange}
                                        min={0}
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Costo" className="label is-small">
                                        Importe IRPf
                                    </label>
                                    <input
                                        className='input'
                                        placeholder="IRPf importe"
                                        type="number"
                                        name="IRPfimp"
                                        value={(parseFloat(formData2.baseimp || 0) * (parseFloat(formData2.IRPf || 0) / 100)).toFixed(2)}
                                        readOnly
                                    />
                                </div>
                            </div>
                            
                            <div className="field mb-4">
                                <Input
                                    label="Total"
                                    type="text"
                                    name="total"
                                    placeholder="Total"
                                    value={(
                                        Math.ceil(((parseFloat(formData2.baseimp || 0) + 
                                        parseFloat(formData2.IVAimp || 0) + 
                                        parseFloat(formData2.IRPfimp || 0)) * 100)) / 100
                                    ).toFixed(2)}
                                    onChange={handleChange}
                                    readOnly
                                    
                                />
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

export default ModalEdit;
