import React from "react";
import ReactDOM from "react-dom";
import "../../styles/DatePicker.css"; // Asegúrate de crear y definir el archivo CSS para el modal

function Modal({ children, onClose }) {
    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;
