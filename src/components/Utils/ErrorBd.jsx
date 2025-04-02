import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../styles/Notification.css'; // Importa los estilos de notificación

// Crea un custom hook que encapsula el uso de `useNavigate` y la función `showErrorAndLogout`
function useErrorAndLogout() {
    const navigate = useNavigate(); // Obtiene la función navigate

    // Función para mostrar la notificación de error y navegar a /logout si se confirma
    const showErrorAndLogout = () => {
        // Muestra una notificación de error utilizando SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se ha producido un error, por favor intente mas tarde',
            confirmButtonText: 'OK', // Texto del botón
            customClass: 'swal2-dark' // Agrega un tema oscuro si lo deseas
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario hace clic en OK, navega hacia /logout
                navigate('/logout');
            }
        });
    };

    // Devuelve la función `showErrorAndLogout`
    return showErrorAndLogout;
}

// Exporta el custom hook
export default useErrorAndLogout;
