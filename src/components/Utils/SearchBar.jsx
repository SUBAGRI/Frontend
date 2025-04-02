import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/SearchBar.css";

function Searchbar({ originalOrders, setOrders, navTab }) {
    const [input, setInput] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (navTab !== "pane-1") {
            setOrders(originalOrders);
        }
    }, [navTab, originalOrders, setOrders]);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase(); // ✅ Se usa directamente el valor del input
        setInput(searchValue);
    
        if (searchValue === "") {
            setOrders(originalOrders); // ✅ Restaura la lista si el input está vacío
            return;
        }
    
        const filteredOrders = originalOrders.filter((order) => {
            const cliente = (order.cliente || "").toLowerCase(); // ✅ Asegura que no sea undefined
            const numfac = (order.numfac || "").toLowerCase();
            const baseimp = String(order.baseimp || "").toLowerCase(); // ✅ Convierte baseimp en string
            const proveedor = (order.proveedor || "").toLowerCase();
            const nombre = (order.nombre || "").toLowerCase();
            const cif = (order.cif || "").toLowerCase(); 
    
            return cliente.includes(searchValue) || 
                   numfac.includes(searchValue) || 
                   baseimp.includes(searchValue) ||
                   proveedor.includes(searchValue) ||
                   nombre.includes(searchValue) ||
                   cif.includes(searchValue)
        });
    
        setOrders(filteredOrders);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);

        if (date) {
            const filteredOrders = originalOrders.filter((order) => {
                const orderDate = new Date(order.fecha);
                return orderDate.toDateString() === date.toDateString();
            });

            setOrders(filteredOrders);
        } else {
            setOrders(originalOrders);
        }
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                type="text"
                placeholder="Buscar..."
                value={input}
                onChange={handleSearch}
            />

            {/* Solo muestra el icono de calendario y DatePicker si navTab es "Orders" */}
            {(
                <>
                    <i className="fas fa-calendar-alt calendar-icon"></i>
                    <DatePicker
                        className="ml-1 mb-1"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        placeholderText="Fecha"
                        dateFormat="dd/MM/yyyy"
                    />
                </>
            )}
        </div>
    );
}

export default Searchbar;
