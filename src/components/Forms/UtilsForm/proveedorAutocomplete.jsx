import { useState } from "react";
import { Input } from "../Input";

const ProveedorAutocomplete = ({ formData, setFormData, clientes, isEditModal }) => {
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = (e) => {
        const searchValue = e.target.value;
        setFormData({ ...formData, proveedor: searchValue });

        if (searchValue.length === 0) {
            setShowSuggestions(false);
            return;
        }

        const filtered = clientes.filter((cliente) =>
            cliente.nombre.toLowerCase().includes(searchValue.toLowerCase())
        );

        setFilteredClientes(filtered);
        setShowSuggestions(filtered.length > 0);
    };

    const handleSelect = (nombre) => {
        setFormData({ ...formData, proveedor: nombre });
        setShowSuggestions(false);
    };

    return (
        <div className="relative">
            <Input
                label="Proveedor"
                className="input"
                type="text"
                name="proveedor"
                placeholder="Proveedor"
                value={formData.proveedor || ""}
                onChange={handleChange}
                autoComplete="nope"
            />
            {showSuggestions && (
                <div
                style={{
                    position: "absolute",
                    top: isEditModal ? "43%" : "47.5%",
                    left: isEditModal ? 30 : 280,
                    width: isEditModal ? "88%" : "44.5%",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    maxHeight: "160px",
                    overflowY: "auto",
                    zIndex: 10,
                }}
            >
                {filteredClientes.map((cliente, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelect(cliente.nombre)}
                        style={{
                            padding: "8px",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f0f0f0";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#fff";
                        }}
                    >
                        {cliente.nombre}
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default ProveedorAutocomplete;