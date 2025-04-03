import { useState } from "react";
import { Input } from "../Input"


const IVA_OPTIONS = ["4", "10", "21"];

function IVAInput({ formData, setFormData }) {
  const [customIVA, setCustomIVA] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const handleChange = (e) => {
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

  return (
    <div className="flex flex-col w-full gap-2">
      <label htmlFor="Costo" className="label is-small">
        IVA %
      </label>
      {!isCustom ? (
        <select
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
        <Input
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