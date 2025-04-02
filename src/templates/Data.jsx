import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Data = ({ FormData }) => {

  const navigate = useNavigate();

  //Si notes esta vacio, se oculta
  useEffect(() => {
    if (FormData.notes === '') {
      const notes = document.querySelector('p:nth-child(6)');
      notes.style.display = 'none';
    }
  }, [FormData.notes]);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString("it-IT", options);
};

  useEffect(() => {
    const footer = document.querySelector('.footer');
    footer.style.display = 'none';

    // Restaurar la visualización del footer al desmontar el componente
    return () => {
      footer.style.display = '';
    };
  }, []);

  const printInvoice = () => {
    const printButton = document.getElementById('botones');
    printButton.style.display = 'none';
 
    // Llamar a la función de impresión
    window.print();

    // Mostrar el botón de impresión nuevamente después de la impresión
    printButton.style.display = '';
    //Mostrar el border de los input
  };

  const handleDataButtonClick = () => {
    navigate(`/pdf/fattura/${FormData.idOrder}`);
    window.location.reload();

  };

  const handleOrdiniButtonClick = () => {
    window.location.href = '/Orders';
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '200px',
  };

  const infoContainerStyle = {
    textAlign: 'center',
    margin: '2rem',
    maxWidth: '350px',
    // texto mas grande
    fontSize: '1.1rem',
  };

  const lastParagraphStyle = {
    textAlign: 'center',
    width: '100%',
    paddingLeft: '20em',
    paddingRight: '20em',
    paddingBottom: '1em',
  };

  const bootstrapLink = document.createElement('link');
  bootstrapLink.rel = 'stylesheet';
  bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css';
  bootstrapLink.integrity = 'sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ';
  bootstrapLink.crossOrigin = 'anonymous';
  document.head.appendChild(bootstrapLink);

  const customStyle = document.createElement('style');
  customStyle.innerHTML = `
    html, body {
      margin: 0px;
      border: 0px;
      padding: 0px;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
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

    hr {
      margin: 0;
    }
  
    .footer {
      display: none;
    }
    @media print {
      /* Ajustar los márgenes */
      @page {
        margin: 0;
      }
    
      /* Ajustar el espaciado */
      body {
        margin: 0;
        padding: 0;
      }
      
    #divtexto {
      -webkit-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -o-transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      transform: rotate(90deg);
    }
    }
    `;
  document.head.appendChild(customStyle);

  return (
    <div id="divtexto" style={containerStyle}>
      <div style={infoContainerStyle}>
        <p style={{fontSize:'12px'}}><strong>Data: </strong>{formatDate(FormData.createdAt)}</p>
        <p><strong>Nome:</strong> {FormData.nameCustomer} {FormData.surnameCustomer}</p>
        <p><strong>Telefono:</strong> {FormData.phoneNumber}</p>
        <p><strong>Modello:</strong> {FormData.modelPhone}</p>
        <p><strong>Deffeto:</strong> {FormData.defect}</p>
        <p><strong>Nota:</strong> {FormData.notes}</p>
        <p><strong>Prezzo:</strong> {FormData.price} €</p>
      </div>
      <div style={{ display: 'flex', alignContent: 'center' }}>
        <p>/-/</p>
        <div style={lastParagraphStyle}>
          <p>Telaggiusto</p>
        </div>
        <p>/-/</p>
      </div>

      <div className="fixed-button-container" id='botones'>
        {/* Botón "Data" a la izquierda */}
        <button className="btn btn-primary mr-auto" onClick={() => handleDataButtonClick()}>Fattura</button>
        {/* Botón "Stampa" en el centro */}
        <button className="btn btn-primary" id='print-button' onClick={() => printInvoice()}>Stampa</button>
        {/* Botón "Ordini" a la derecha */}
        <button className="btn btn-primary ml-auto" onClick={() => handleOrdiniButtonClick()}>Ordini</button>
      </div>
    </div>
  );
};

export default Data;
