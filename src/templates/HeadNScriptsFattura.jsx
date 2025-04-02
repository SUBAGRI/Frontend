import React, { useEffect } from 'react';

const HeadAndScripts = () => {
  useEffect(() => {
    // Configurar el <head>
    document.title = 'Fattura';

    // Agregar Bootstrap CSS
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css';
    bootstrapLink.integrity = 'sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ';
    bootstrapLink.crossOrigin = 'anonymous';
    document.head.appendChild(bootstrapLink);

    // Agregar estilos personalizados
    const customStyle = document.createElement('style');
    customStyle.innerHTML = `
    
    :root {
      --body-font: 'Poppins', sans-serif;
    }
    
    /* Sobrescribir Bootstrap */
    body {
      --bs-font-sans-serif: 'Poppins', sans-serif;
      --bs-body-font-family: var(--bs-font-sans-serif);
      --bs-body-font-size: 1rem;
      --bs-body-font-weight: 400;
      --bs-body-line-height: 2;
      --bs-body-color: #41403E;
      --bs-primary: #0070E4;
      --bs-primary-rgb: 0, 112, 228;
      --bs-border-color: #eeeeee;
    
      /* Establecer márgenes en cero para el cuerpo */
      margin: 0;
    }

    .footer {
      display: none;
    }
    
    .input-like-h4 {
      background-color: transparent;
      font-size: 23.6688px;
      font-family: sans-serif;
      font-weight: bold;
      color: inherit;
      margin-bottom: 0;
      max-width: 260px;
      max-height: 24.45px;
      margin-bottom: 8px;
      padding: 0;
      width: auto;
    }

    .fixed-button-container {
      position: fixed;
      bottom: 20px;
      left: 50%; /* Centra el contenedor horizontalmente */
      transform: translateX(-50%); /* Centra el contenedor horizontalmente */
      display: flex;
      align-items: center;
  }
  
  .fixed-button-container button {
      margin: 0 10px; /* Espacio entre los botones */
  }
    
    .input-like-li {
      border: none;
      background-color: transparent;
      font-size: 1rem;
      font-weight: normal;
      color: inherit;
      margin-bottom: 0.5rem;
      padding: 0;
      max-width: 120px;
      width: 100%;
    }

    @media print {
      /* Establecer márgenes en cero para el cuerpo */
      body {
        margin: 0;
      }
    
      /* Establecer márgenes en cero para la página */
      @page {
        margin: 0;
      }
    }
    
    `;
    document.head.appendChild(customStyle);

    // Agregar Google Fonts
    const googleFontsLink = document.createElement('link');
    googleFontsLink.rel = 'stylesheet';
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(googleFontsLink);

    // Agregar Bootstrap Bundle JS
    const bootstrapBundleScript = document.createElement('script');
    bootstrapBundleScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js';
    bootstrapBundleScript.integrity = 'sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe';
    bootstrapBundleScript.crossOrigin = 'anonymous';
    document.body.appendChild(bootstrapBundleScript);

    // Agregar Iconify Icon JS
    const iconifyScript = document.createElement('script');
    iconifyScript.src = 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js';
    document.body.appendChild(iconifyScript);

    // Limpiar al desmontar el componente
    return () => {
      document.head.removeChild(bootstrapLink);
      document.head.removeChild(customStyle);
      document.head.removeChild(googleFontsLink);
      document.body.removeChild(bootstrapBundleScript);
      document.body.removeChild(iconifyScript);
    };
  }, []);

  return null;
};

export default HeadAndScripts;
