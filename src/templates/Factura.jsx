import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const DownloadExcel = () => {
        // Crear un nuevo libro de trabajo
        const wb = XLSX.utils.book_new();
        
        // Definir los datos exactamente como en el archivo original
        const data = [
            ["", "TRANSFORMACIONES SUBAGRI, S.L.", "", "", "", "", "FACTURA"],
            ["", "C.I.F: B-91475913"],
            ["", ""],
            ["", "Cl Albina s/n"],
            ["", "Ftes de Andalucia 41420"],
            ["", "Tel: 954 837 001"],
            ["", "Email: contacto@subagri.com"],
            ["", ""],
            ["", "Cliente:", "", "Fecha:", "", "Factura Nº:", ""],
            ["", "Nombre Cliente", "", "01/04/2025", "", "F145"],
            ["", "Dirección Cliente"],
            ["", ""],
            ["", "Descripción", "Cantidad", "Precio Unitario", "Total"],
            ["", "Producto A", "2", "50.00", "100.00"],
            ["", "Producto B", "1", "75.00", "75.00"],
            ["", "Producto C", "3", "20.00", "60.00"],
            ["", ""],
            ["", "Subtotal", "", "", "235.00"],
            ["", "IVA (21%)", "", "", "49.35"],
            ["", "Total", "", "", "284.35"],
            ["", ""],
            ["", "Forma de pago: Transferencia bancaria"],
            ["", "IBAN: ES91 2100 0418 4502 0005 1332"],
            ["", ""],
            ["", "Gracias por su compra"]
        ];
        
        // Crear una hoja con los datos
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Ajustar el formato de las celdas
        ws['!cols'] = [
            { wch: 5 },
            { wch: 40 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 15 }
        ];
        
        // Agregar la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, "PROJ FRIO F145");
        
        // Escribir y descargar el archivo
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Intento1.xlsx');
    };