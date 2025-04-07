import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// Función para cargar la plantilla y generar el archivo modificado
export const generateResiduos = async (formData) => {
    try {

        // Cargar el archivo de plantilla
        const response = await fetch("/residuosplantilla.docx");
        const arrayBuffer = await response.arrayBuffer();
        
        // Cargar el contenido en PizZip
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });  

        // Filtrar tractoras vacías

        const [year, month, day] = formData.fechaFactura.split("-");
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const mesEscrito = meses[parseInt(month, 10) - 1];
        const fechaFormateada = `${day}-${month}-${year}`;

        // Rellenar datos en el documento
        doc.render({ factura: formData.numeroFactura, dia: day, mes: mesEscrito });

        // Generar el archivo Word
        const output = doc.getZip().generate({ type: "blob" });

        // Descargar el documento
        saveAs(output, `Residuos F${formData.numeroFactura} ${formData.cliente}.docx`);
    } catch (error) {
        console.error("Error generando el documento:", error);
    }   
};