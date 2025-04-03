import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from './Input';
import IVAInput from "./UtilsForm/InputIVA";
import Swal from 'sweetalert2';
import ClienteAutocomplete from './UtilsForm/clienteAutocomplete'
import ProveedorAutocomplete from './UtilsForm/proveedorAutocomplete'

function FormOrder({ tipo, clientes }) {
    const methods = useForm();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const sitio = localStorage.getItem("Sitio");

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkMode, setIsDarkMode] = useState(darkModeMediaQuery.matches);

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

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const currentDateTime = `${currentDate}T${currentTime}`;
        setFormData({ ...formData, createdAt: currentDateTime});
    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
    
        setFormData((prevData) => {
            let updatedData = { ...prevData, [name]: inputValue };

            // Si el campo es numérico, eliminar ceros iniciales (excepto "0" solo)
            if (!isNaN(inputValue) && inputValue.length > 1 && inputValue.startsWith("0")) {
                let cleanedValue = inputValue.replace(/^0+/, ""); // Quita los ceros iniciales
                updatedData[name] = cleanedValue;
            }
    
            if (name === 'baseimp' || name === 'IVA') {
                updatedData.total = Math.ceil(
                    (parseFloat(updatedData.baseimp || 0) + 
                    parseFloat(updatedData.IVAimp || 0) + 
                    parseFloat(updatedData.IRPfimp || 0)) * 100
                ) / 100;
                
                updatedData.IVAimp = Math.ceil(
                    (parseFloat(updatedData.baseimp || 0) * 
                    (parseFloat(updatedData.IVA || 0) / 100)) * 100
                ) / 100;
            }
    
            if (name === 'baseimp' || name === 'IRPf') {
                updatedData.IRPfimp = Math.ceil(
                    (parseFloat(updatedData.baseimp || 0) * 
                    (parseFloat(updatedData.IRPf || 0) / 100)) 
                );
            }
    
            return updatedData;
        });
    };

    const handleSubmit = methods.handleSubmit(async (e) => {

        try {
            const url = tipo === 'facturas' ? "/orders/" : "/facturasRec/";
            const response = await api.post('/api' + url, formData);
            console.log(response);
            // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'success',
                title: 'Factura añadida correctamente',
                text: "¿Quieres añadir otra?.",
                customClass: isDarkMode ? 'swal2-dark' : '',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    setFormData({})
                    // Navega a la página de inicio actual
                    if (url === '/facturasRec/') {
                        navigate('/orders/create/recibidas');
                    } else {
                        navigate('/orders/create/facturas');
                    }
                } else {
                    navigate('/orders');
                }
            });
        } catch (error) {
            // Muestra una notificación de error con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "La factura no se ha podido crear",
                timer: 2000, // Cierra automáticamente después de 3 segundos
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
            });
        }

    });

    return (
        <div className="container" style={{ margin: '30px auto', maxWidth: '1000px' }}>
            <div className="columns is-justify-content-center is-align-items-center">
                <div className="column is-8-tablet is-7-desktop is-6-widescreen">
                    {/* Encabezado con botón "Back to Home" e icono de home */}
                    <div className="is-flex is-justify-content-space-between">
                        <h2 className="title is-2">Crear Factura</h2>
                        <Link to="/orders" className="button is-link is-small px-5" style={{ height: '50px' }}>
                            <span className="icon">
                                <i className="fas fa-home"></i>
                            </span>
                            <span>Home</span>
                        </Link>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={e => e.preventDefault()} noValidate className="box p-5">
                            {/* Formulario */}
                            <div className="field mb-4 is-grouped" style={{justifyContent:'space-between'}}>
                                <Input
                                    label="Fecha"
                                    type="date"
                                    name="fecha"
                                    placeholder="Fecha"
                                    value={formData.fecha || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Nª Factura"
                                    type="text"
                                    name="numfac"
                                    placeholder="Nª Factura"
                                    value={formData.numfac || ''}
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

                            {/* Campos de "Pezzo" y "Costo" en el mismo div */}
                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Pezzo" className="label is-small">
                                        Base Imponible
                                    </label>
                                    <Input
                                        className='input'
                                        type="number"
                                        name="baseimp"
                                        placeholder="Base imponible"
                                        value={formData.baseimp || 0}
                                        onChange={handleChange}
                                        min={0}
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <IVAInput formData={formData} setFormData={setFormData} />
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Costo" className="label is-small">
                                        IVA importe
                                    </label>
                                    <Input
                                        className='input'
                                        placeholder="IVA importe"
                                        type="number"
                                        name="IVAimp"
                                        value={(parseFloat(formData.baseimp || 0) * (parseFloat(formData.IVA || 0) / 100)).toFixed(2)}
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
                                        value={formData.IRPf || 0}
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
                                        value={(parseFloat(formData.baseimp || 0) * (parseFloat(formData.IRPf || 0) / 100)).toFixed(2)}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="field mb-4">
                                Total
                                <input
                                    className='input'
                                    label="Total"
                                    type="text"
                                    name="total"
                                    placeholder="Total"
                                    value={(formData.total).toFixed(2)}
                                    readOnly
                                    
                                />
                            </div>

                            {/* Botón de envío */}
                            <div className="m-3 columns is-justify-content-center is-align-items-center">
                                <button type="submit" onClick={handleSubmit} className="button is-link px-5">Guardar</button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}

export default FormOrder;