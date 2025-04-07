import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// Función para cargar la plantilla y generar el archivo modificado
export const generateExportador = async (formData) => {
    try {

        // Cargar el archivo de plantilla
        const response = await fetch("/exportadorplantilla.docx");
        const arrayBuffer = await response.arrayBuffer();
        
        // Cargar el contenido en PizZip
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });  

        // Filtrar tractoras vacías

        const [year, month, day] = formData.fechaFactura.split("-");
       
        const fechaFormateada = `${day}-${month}-${year}`;

        // Rellenar datos en el documento
        doc.render({ factura: formData.numeroFactura, fecha: fechaFormateada});

        // Generar el archivo Word
        const output = doc.getZip().generate({ type: "blob" });

        // Descargar el documento
        saveAs(output, `EXPORTADOR F${formData.numeroFactura} ${formData.cliente}.docx`);
    } catch (error) {
        console.error("Error generando el documento:", error);
    }   
};