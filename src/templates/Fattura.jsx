import React from 'react';
import { useEffect, useState } from 'react';
import HeadAndScripts from './HeadNScriptsFattura';
import { useNavigate } from 'react-router-dom';
import DataPrivacyNotice from './DataPrivacy';

const InvoiceComponent = ({ FormData }) => {

    const navigate  = useNavigate();

    const [InvoceData, setInvoceData] = useState({
        date: '',
        nameSurname: '',
        descrizione: '',
        cuantity: 1,
        iva: 22,
        price: 0.0,
        totalProducto: 0,
        totalIva: 0,
        totalNetto: 0,
        priceWithoutIva: 0,
        ...FormData // Incluye las claves adicionales de FormData
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        let inputValue = type === 'checkbox' ? checked : value;

        setInvoceData({ ...InvoceData, [name]: inputValue });

        //iva cant be more than 100
        if (name === 'iva' && parseFloat(inputValue) > 100) {
            setInvoceData({ ...InvoceData, [name]: 100 });
        }

    };

    const printInvoice = () => {
        // Ocultar el botón de impresión
        const printButton = document.getElementById('botones');
        printButton.style.display = 'none';
        //Ocultar el border de los input
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.border = 'none';
        });

        // Llamar a la función de impresión
        window.print();

        // Mostrar el botón de impresión nuevamente después de la impresión
        printButton.style.display = '';
        //Mostrar el border de los input

        inputs.forEach(input => {
            input.style.border = '1px solid #ced4da';
        }
        );
    };

    useEffect(() => {

        const currentDate = new Date().toISOString().split('T')[0];
        const currentDateTime = `${currentDate}`;

        const price = !isNaN(parseFloat(FormData.price)) ? parseFloat(FormData.price) : 0.0;

        setInvoceData(prevData => ({
            ...prevData,
            date: currentDateTime,
            nameSurname: FormData.nameCustomer + " " + FormData.surnameCustomer,
            descrizione: FormData.modelPhone + " " + FormData.defect,
            price: price,
            phoneNumber: FormData.phoneNumber,
            idOrder: FormData.idOrder

        }));
    }, [FormData]);

    useEffect(() => {

        if (!isNaN(InvoceData.price) && !isNaN(InvoceData.cuantity)) {
            const priceWithoutIva = InvoceData.price / ((InvoceData.iva / 100) + 1);
            const totalProducto = priceWithoutIva * InvoceData.cuantity;
            const totalIva = totalProducto * (InvoceData.iva / 100);

            setInvoceData(prevData => ({
                ...prevData,
                totalProducto: totalProducto,
                totalIva: totalIva,
                priceWithoutIva: priceWithoutIva
            }));
        }
    }, [InvoceData.price, InvoceData.cuantity, InvoceData.iva]);

    const handleDataButtonClick = () => {
        navigate(`/pdf/data/${InvoceData.idOrder}`);
    };

    const handleOrdiniButtonClick = () => {
        window.location.href = '/Orders'; 
    };

    return (
        <div>
            <section id="invoice">
                <HeadAndScripts />

                <div className="container mt-3 pt-3" >
                    <div className="d-md-flex justify-content-between align-items-center mb-3">
                        <div className="col-md-6">
                            <div className="text">
                                <img src="/img/logo.png" alt="" style={{ maxHeight: '80px' }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="text-md-end ">
                                <h2 className="display-5 fw-bold">Preventivo </h2>
                                <p className="m-0">Numero Preventivo: {InvoceData.idOrder}</p>
                                <p className="m-0" onChange={handleChange}>Data Preventivo: {InvoceData.date}</p>
                            </div>
                        </div>
                    </div>

                    <div className="d-md-flex justify-content-between mt-4 pt-4">
                        <div>
                            <p className="text-primary">Prestatore</p>
                            <h4>Telaggiusto SRL</h4>
                            <ul className="list-unstyled">
                                <li>Viale Del Lavoro, 4/n</li>
                                <li>60035 Jesi (AN)</li>
                                <li>Telaggiustojesi@gmail.com</li>
                                <li>C.F. / P.IVA 02839950421</li>
                            </ul>
                        </div>
                        <div className="mt-5 mt-md-0 text-md-end" style={{ alignItems: 'center' }}>
                            <p className="text-primary">Committente</p>
                            <input type="text" className="form-control text-md-end input-like-h4" onChange={handleChange} name='nameSurname' value={InvoceData.nameSurname} />
                            <ul className="list-unstyled" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                                <input type="text" className="form-control text-md-end input-like-li me-2" onChange={handleChange} name='phoneNumber' value={InvoceData.phoneNumber}></input>
                                <iconify-icon className="social-icon text-primary fs-5 ms-5" icon="solar:phone-bold"></iconify-icon>
                            </ul>
                        </div>
                    </div>

                    <table className="table border my-5" style={{ backgroundColor: 'white' }}>
                        <thead>
                            <tr className="bg-primary-subtle" style={{ color: 'black' }}>
                                <th scope="col">Codice</th>
                                <th scope="col">Descrizione</th>
                                <th scope="col">Prezzo</th>
                                <th scope="col">Quantità</th>   
                                <th scope="col">Totale</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>{InvoceData.descrizione}</td>
                                <td><input type="number" className="form-control" onChange={handleChange} name='priceWithoutIva' value={InvoceData.priceWithoutIva.toFixed(2)} style={{ maxWidth: '75px'}} /></td>
                                <td><input type="number" className="form-control" onChange={handleChange} name='cuantity' value={InvoceData.cuantity} style={{ maxWidth: '75px'}} /></td>
                                <td style={{ position: 'relative' }}><input type="number" className="form-control" onChange={handleChange} name='totalProducto' value={InvoceData.totalProducto.toFixed(2)} style={{ maxWidth: '75px', backgroundColor: 'white' }} disabled />
                                    <span style={{ position: 'absolute', top: '50%', right: '31px', transform: 'translateY(-50%)' }}>€</span>
                                </td>
                            </tr>
                            <tr>
                                <th></th>
                                <td></td>
                                <td></td>
                                <td className="text-primary fw-bold">IVA (iva)</td>
                                <td style={{ position: 'relative' }}
                                ><input type="number" className="form-control" name='iva' onChange={handleChange} value={InvoceData.iva} style={{ maxWidth: '75px' }} />
                                    <span style={{ position: 'absolute', top: '50%', right: '31px', transform: 'translateY(-50%)' }}>%</span>
                                </td>
                            </tr>
                            <tr>
                                <th></th>
                                <td></td>
                                <td></td>
                                <td className="text-primary fw-bold">Totale documento:</td>
                                <td style={{ position: 'relative' }}><input type="number" className="form-control" onChange={handleChange} value={InvoceData.totalIva.toFixed(2)} style={{ maxWidth: '75px'}} disabled />
                                    <span style={{ position: 'absolute', top: '50%', right: '31px', transform: 'translateY(-50%)' }}>€</span>
                                </td>
                            </tr>
                            <tr>
                                <th></th>
                                <td></td>
                                <td></td>
                                <td className="text-primary fw-bold">Netto da pagare:</td>
                                <td style={{ position: 'relative' }}><input type="number" className="form-control" name="price" onChange={handleChange} value={InvoceData.price} style={{ maxWidth: '90px'}} />
                                    <span style={{ position: 'absolute', top: '50%', right: '31px', transform: 'translateY(-50%)' }}>€</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <h4 className="fw-bold my-0">Contatti</h4>

                    <div className="d-md-flex justify-content-between mb-5">
                        <div>
                            <h6 className="fw-bold my-3">Telaggiusto Jesi</h6>
                            <ul className="list-unstyled">
                                <li><iconify-icon className="social-icon text-primary fs-5 me-2" icon="mdi:location" style={{ verticalAlign: 'text-bottom' }}></iconify-icon> Viale Del Lavoro, 4/n </li>
                                <li><iconify-icon className="social-icon text-primary fs-5 me-2" icon="ic:baseline-markunread-mailbox" style={{ verticalAlign: 'text-bottom' }}></iconify-icon> JESI 60035 (AN)</li>
                                <li><iconify-icon className="social-icon text-primary fs-5 me-2" icon="solar:phone-bold" style={{ verticalAlign: 'text-bottom' }}></iconify-icon> 3389541441</li>
                                <li><iconify-icon className="social-icon text-primary fs-5 me-2" icon="ic:baseline-email" style={{ verticalAlign: 'text-bottom' }}></iconify-icon> Telaggiustojesi@gmail.com</li>
                            </ul>
                        </div>
                        <div>
                            <h6 className="fw-bold my-3 text-md-end">Telaggiusto Senigalia</h6>
                            <ul className="list-unstyled text-md-end" >
                                <li> Via Piave, 27/2 <iconify-icon className="social-icon text-primary fs-5 me-2" icon="mdi:location" style={{ verticalAlign: 'text-bottom' }}></iconify-icon></li>
                                <li> SENIGALLIA 60019 (AN) <iconify-icon className="social-icon text-primary fs-5 me-2" icon="ic:baseline-markunread-mailbox" style={{ verticalAlign: 'text-bottom' }}></iconify-icon></li>
                                <li> 3661435743 <iconify-icon className="social-icon text-primary fs-5 me-2" icon="solar:phone-bold" style={{ verticalAlign: 'text-bottom' }}></iconify-icon></li>
                                <li> Telaggiustosenigalia@gmail.com <iconify-icon className="social-icon text-primary fs-5 me-2" icon="ic:baseline-email" style={{ verticalAlign: 'text-bottom' }}></iconify-icon>  </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="fixed-button-container" id='botones'>
                    {/* Botón "Data" a la izquierda */}
                    <button className="btn btn-primary mr-auto" onClick={() => handleDataButtonClick()}>Data</button>
                    {/* Botón "Stampa" en el centro */}
                    <button className="btn btn-primary" id='print-button' onClick={() => printInvoice()}>Stampa</button>
                    {/* Botón "Ordini" a la derecha */}
                    <button className="btn btn-primary ml-auto" onClick={() => handleOrdiniButtonClick()}>Ordini</button>
                </div>
            </section>

            <DataPrivacyNotice />
        </div>
    );
};

export default InvoiceComponent;
