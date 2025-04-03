import React, { useState } from 'react';
import {ModifyExcel} from '../templates/Factura'

const ClientForm = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    cliente: '',
    numeroFactura: '',
    fechaFactura: '',
    tipoPaja: '',
    numeroBultos: '',
    numeroCamiones: 1,
    camiones: [{ matriculaRemolque: '', matriculaTractora: '', kilos: '' }],
  });

  // Lista de clientes (puedes cargarla dinámicamente)
  const clientes = ['STE PROJ FRIO SARL', 'Cliente 2', 'Cliente 3'];

  // Lista de tipos de paja
  const tiposDePaja = ['Heno de avena', 'Guisante', 'Imabe', 'Jovisa', 'Paquete pequeño'];

  // Función para manejar el cambio en cualquier campo del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar cambios en los inputs de los camiones
  const handleCamionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCamiones = [...formData.camiones];
    updatedCamiones[index] = {
      ...updatedCamiones[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      camiones: updatedCamiones,
    });
  };

  // Función para manejar el cambio en el número de camiones
  const handleNumeroCamionesChange = (e) => {
    const numeroCamiones = parseInt(e.target.value, 10);
    const camiones = Array.from({ length: numeroCamiones }, () => ({
      matriculaRemolque: '',
      matriculaTractora: '',
      kilos: '',
    }));
    setFormData({
      ...formData,
      numeroCamiones,
      camiones,
    });
  };

  // Función para calcular el total de kilos
  const calcularTotalKilos = () => {
    return formData.camiones.reduce((total, camion) => total + parseFloat(camion.kilos || 0), 0);
  };

  // Manejar el envío del formulario (por ahora solo logueamos los datos)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await ModifyExcel(formData);
    console.log(formData);
    
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Formulario de Factura</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Cliente */}
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="cliente" className="label is-small" style={{ marginBottom: '5.25px' }}>
            Cliente
          </label>
          <select
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            className="input"
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '400px', // Tamaño máximo del input
            }}
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente} value={cliente}>
                {cliente}
              </option>
            ))}
          </select>
        </div>

        {/* Número de factura */}
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="numeroFactura" className="label is-small" style={{ marginBottom: '5.25px' }}>
            Número de Factura
          </label>
          <input
            type="text"
            id="numeroFactura"
            name="numeroFactura"
            value={formData.numeroFactura}
            onChange={handleChange}
            className="input"
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '400px', // Tamaño máximo del input
            }}
          />
        </div>

        {/* Fecha de factura */}
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="fechaFactura" className="label is-small" style={{ marginBottom: '5.25px' }}>
            Fecha de Factura
          </label>
          <input
            type="date"
            id="fechaFactura"
            name="fechaFactura"
            value={formData.fechaFactura}
            onChange={handleChange}
            className="input"
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '400px', // Tamaño máximo del input
            }}
          />
        </div>

        {/* Tipo de Paja */}
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="tipoPaja" className="label is-small" style={{ marginBottom: '5.25px' }}>
            Tipo de Paja
          </label>
          <select
            name="tipoPaja"
            value={formData.tipoPaja}
            onChange={handleChange}
            className="input"
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '400px', // Tamaño máximo del input
            }}
          >
            <option value="">Selecciona un tipo de paja</option>
            {tiposDePaja.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Número de bultos */}
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="numeroBultos" className="label is-small" style={{ marginBottom: '5.25px' }}>
            Número de Bultos
          </label>
          <input
            type="number"
            id="numeroBultos"
            name="numeroBultos"
            value={formData.numeroBultos}
            onChange={handleChange}
            className="input"
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '400px', // Tamaño máximo del input
            }}
          />
        </div>

        {/* Número de camiones */}
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="numeroCamiones" className="label is-small" style={{ marginBottom: '5.25px' }}>
            Número de Camiones
          </label>
          <select
            name="numeroCamiones"
            value={formData.numeroCamiones}
            onChange={handleNumeroCamionesChange}
            className="input"
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '400px', // Tamaño máximo del input
            }}
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Total Kilos */}
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="totalKilos" className="label is-small" style={{ marginBottom: '5.25px' }}>
            Total de Kilos
          </label>
          <input
            type="text"
            id="totalKilos"
            name="totalKilos"
            value={calcularTotalKilos()}
            readOnly
            className="input"
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '400px',
            }}
          />
        </div>

        {/* Matrículas de los camiones */}
        {formData.camiones.map((camion, index) => (
          <div key={index} className="flex flex-col w-full gap-2 border-t pt-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Camión {index + 1}</h4>
            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-evenly', maxWidth: '700px' }}>
              <div className="flex flex-col w-1/3 gap-2">
                <label htmlFor={`matriculaRemolque-${index}`} className="label">
                  Matrícula Remolque
                </label>
                <input
                  type="text"
                  id={`matriculaRemolque-${index}`}
                  name="matriculaRemolque"
                  value={camion.matriculaRemolque}
                  onChange={(e) => handleCamionChange(index, e)}
                  className="input"
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    borderRadius: '4px',
                    width: '100%',
                  }}
                />
              </div>
              <div className="flex flex-col w-1/3 gap-2">
                <label htmlFor={`matriculaTractora-${index}`} className="label">
                  Matrícula Tractora
                </label>
                <input
                  type="text"
                  id={`matriculaTractora-${index}`}
                  name="matriculaTractora"
                  value={camion.matriculaTractora}
                  onChange={(e) => handleCamionChange(index, e)}
                  className="input"
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    borderRadius: '4px',
                    width: '100%',
                  }}
                />
              </div>
              <div className="flex flex-col w-1/3 gap-2">
                <label htmlFor={`kilos-${index}`} className="label">
                  Kilos
                </label>
                <input
                  type="number"
                  id={`kilos-${index}`}
                  name="kilos"
                  value={camion.kilos}
                  onChange={(e) => handleCamionChange(index, e)}
                  className="input"
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    borderRadius: '4px',
                    width: '100%',
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ClientForm;
