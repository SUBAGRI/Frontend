import { useState } from "react";
import { Input } from "../Input";

const ClienteAutocomplete = ({ formData, setFormData, clientes }) => {
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = (e) => {
        const searchValue = e.target.value;
        setFormData({ ...formData, cliente: searchValue });

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
        setFormData({ ...formData, cliente: nombre });
        setShowSuggestions(false);
    };

    return (
        <div className="relative">
            <Input
                label="Cliente"
                className="input"
                type="text"
                name="cliente"
                placeholder="Cliente"
                value={formData.cliente || ""}
                onChange={handleChange}
            />
            {showSuggestions && (
                <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded shadow-lg z-10">
                    {filteredClientes.map((cliente, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelect(cliente.nombre)}
                        >
                            {cliente.nombre}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClienteAutocomplete;