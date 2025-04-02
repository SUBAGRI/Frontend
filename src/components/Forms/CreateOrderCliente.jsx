import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from './Input';

function FormOrderCliente() {
    const methods = useForm();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
    
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: inputValue };
    
            return updatedData;
        });
    };

    const handleSubmit = methods.handleSubmit(async (e) => {
            try {                       
                await api.post('/api/clientes/', formData);
                alert('Order created successfully');
                navigate('/orders'); // Redirigir a la página principal
            } catch (error) {
                alert('An error occurred while creating the order');
            }
    });

    return (
        <div className="container" style={{ margin: '30px auto', maxWidth: '1000px' }}>
            <div className="columns is-justify-content-center is-align-items-center">
                <div className="column is-8-tablet is-7-desktop is-6-widescreen">
                    {/* Encabezado con botón "Back to Home" e icono de home */}
                    <div className="is-flex is-justify-content-space-between">
                        <h2 className="title is-2">Create Order</h2>
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
                        
                            <div className="field mb-4">
                                <Input
                                    label="Nombre"
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    value={formData.nombre || ''}
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
                                    value={formData.tel || ''}
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
                                    value={formData.direccion || ''}
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
                                        value={formData.cif || ""}
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
                                        value={formData.cp || 0}
                                        onChange={handleChange}
                                        maxWidth={5}
                                    />
                                </div>
                            </div>
                            

                            {/* Botón de envío */}
                            <div className="m-3 columns is-justify-content-center is-align-items-center">
                                <button type="submit" onClick={handleSubmit} className="button is-link px-5">Save</button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}

export default FormOrderCliente;