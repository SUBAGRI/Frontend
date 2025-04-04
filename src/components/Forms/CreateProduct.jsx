import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from './Input';
import Swal from 'sweetalert2';

function FormProduct() {
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

    const TIPO_OPTIONS = ["Venta", "Compra"];

    const handleSubmit = methods.handleSubmit(async (e) => {

        try {
            const response = await api.post('/api/codigoProducto/', formData);
            console.log(response);
            await Swal.fire({   
                icon: 'success',
                title: 'Producto añadido correctamente',
                text: "¿Quieres añadir otra?.",
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    setFormData({})
                    // Navega a la página de inicio actual
                    navigate('/orders/create/codigoProducto');
                } else {
                    navigate('/orders');
                }
            });
        } catch (error) {
            console.log(error)
            // Muestra una notificación de error con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "El producto no se ha podido crear",
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
                        <h2 className="title is-2">Añadir producto</h2>
                        <Link to="/orders" className="button is-link is-small px-5" style={{ height: '50px' }}>
                            <span className="icon">
                                <i className="fas fa-home"></i>
                            </span>
                            <span>Atras</span>
                        </Link>
                    </div>

                    <FormProvider {...methods}>
                        <form autoComplete='off' onSubmit={e => e.preventDefault()} noValidate className="box p-5">
                            <input autoComplete="off" name="hidden" type="text" style={{display:"none"}}></input>
                            {/* Formulario */}
                        
                            <div className="field mb-4">
                                <Input
                                    label="Producto"
                                    type="text"
                                    name="nombre"
                                    placeholder="Producto"
                                    value={formData.nombre || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field mb-4">
                                <label htmlFor="Telefono" className="label is-small">
                                    Codigo
                                </label>
                                <input
                                    className='input'
                                    type="text"
                                    name="codigo"
                                    placeholder="Codigo"
                                    value={formData.codigo || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Campos de "Pezzo" y "Costo" en el mismo div */}
                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Pezzo" className="label is-small">
                                        Tipo
                                    </label>
                                    <select
                                        type="input"
                                        className="input" 
                                        name="tipo"
                                        value={formData.tipo || ""}
                                        onChange={handleChange}
                                        >
                                        <option value="">Selecciona Tipo</option>
                                        {TIPO_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                            {option}
                                            </option>
                                        ))}
                                        </select>
                                </div>
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

export default FormProduct;