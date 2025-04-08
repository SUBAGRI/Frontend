import { useState } from "react";
import { Input } from "../Input";

const ProductoAutocomplete = ({ formData, setFormData, productos, isEditModal }) => {
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = (e) => {
        const searchValue = e.target.value;
        setFormData({ ...formData, producto: searchValue });

        if (searchValue.length === 0) {
            setShowSuggestions(false);
            return;
        }

        const filtered = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(searchValue.toLowerCase())
        );

        setFilteredClientes(filtered);
        setShowSuggestions(filtered.length > 0);
    };

    const handleSelect = (nombre) => {
        setFormData({ ...formData, producto: nombre });
        setShowSuggestions(false);
    };

    return (
        <div className="relative">
            <Input
                label="Producto"
                className="input"
                type="text"
                name="producto"
                placeholder="Producto"
                value={formData.producto || ""}
                onChange={handleChange}
                autoComplete="off"
            />
            {showSuggestions && (
                <div
                style={{
                    position: "absolute",
                    top: isEditModal ? "52.8%" : "57%",
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
                {filteredClientes.map((producto, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelect(producto.nombre)}
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
                        {producto.nombre}
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default ProductoAutocomplete;