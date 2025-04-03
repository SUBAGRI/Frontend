import { useState, useEffect } from "react";
import { Input } from "../Input"


const IVA_OPTIONS = ["4", "10", "21"];

function IVAInput({ formData, setFormData, handleChange2 }) {
  const [customIVA, setCustomIVA] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const handleChange = (e) => {
    handleChange2(e)
    const { value } = e.target;

    if (value === "custom") {
      setIsCustom(true);
      setFormData({ ...formData, IVA: "" }); // Reinicia el valor al cambiar a personalizado
    } else {
      setIsCustom(false);
      setFormData({ ...formData, IVA: value });
      
    }
  };

  const handleCustomChange = (e) => {
    setCustomIVA(e.target.value);
    setFormData({ ...formData, IVA: e.target.value });
  };

  // Calcular IVAimp y total cuando se cambia el IVA
  useEffect(() => {
    if (formData.IVA) {
      // Calcular IVAimp
      const IVAimp = Math.ceil(
        (parseFloat(formData.baseimp || 0) * (parseFloat(formData.IVA || 0) / 100)) * 100
      ) / 100;

      // Actualizar IVAimp en el formData
      setFormData((prevData) => ({
        ...prevData,
        IVAimp: IVAimp,
        total: Math.ceil(
          (parseFloat(prevData.baseimp || 0) + IVAimp + parseFloat(prevData.IRPfimp || 0)) * 100
        ) / 100,
      }));
    }
  }, [formData.IVA, formData.baseimp]); // Recalcular cuando IVA o baseimp cambien

  return (
    <div className="flex flex-col w-full gap-2">
      <label htmlFor="Costo" className="label is-small" style={{marginBottom:'25.25px'}}>
        IVA %
      </label>
      {!isCustom ? (
        <select
          type="input"
          className="input" 
          name="IVA"
          value={formData.IVA || ""}
          onChange={handleChange}
        >
          <option value="">Selecciona IVA</option>
          {IVA_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}%
            </option>
          ))}
          <option value="custom">Otro (escribir)</option>
        </select>
      ) : (
        <input
          className="input"
          placeholder="Introduce IVA"
          type="number"
          name="IVA"
          value={customIVA}
          onChange={handleCustomChange}
        />
      )}
    </div>
  );
}

export default IVAInput;