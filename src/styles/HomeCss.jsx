import React, { useEffect } from "react";

const HomeCss = () => {
    useEffect(() => {
        document.title = "Home";

        const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css';
    bootstrapLink.integrity = 'sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ';
    bootstrapLink.crossOrigin = 'anonymous';
    document.head.appendChild(bootstrapLink);

        const style = document.createElement("style");
        style.innerHTML = `
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start; /* Ajustar la posición vertical de los elementos */
            height: 100vh;
            text-align: center;
            padding-top: 20px; /* Añadir un poco de padding para separar del borde superior */
        }
        
        .logo {
            width: 700px; /* Ajusta el tamaño del logo según sea necesario */
            margin-bottom: 40px; /* Más espacio debajo del logo */
        }
        
        .buttons-container {
            display: flex;
            justify-content: center;
            gap: 100px; /* Aumenta el espacio entre los botones */
            flex-wrap: wrap; /* Ajusta los botones al tamaño de la pantalla */
        }
        
        .image-button {
            position: relative;
            width: 350px; /* Aumenta el tamaño de los botones */
            height: 350px; /* Aumenta el tamaño de los botones */
            border: none;
            background-size: cover;
            background-position: center;
            cursor: pointer;
        }
        
        .image-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Semitransparencia */
            z-index: 1;
        }
        
        .overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }
        @media (max-width: 768px) {
            .buttons-container {
                gap: 10px;
            }

            .image-button {
                width: 250px;
                height: 250px;
            }

            .overlay {
                font-size: 18px;
            }
        }

        @media (max-width: 480px) {
            .logo {
                width: 350px;
                margin-bottom: 20px;
            }

            .image-button {
                width: 230px;
                height: 230px;
            }

            .overlay {
                font-size: 16px;
            }
        }
            `;


        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
            document.head.removeChild(bootstrapLink);
        };
    }, []);

    return null;
}

export default HomeCss;