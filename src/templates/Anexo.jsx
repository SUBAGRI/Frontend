import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// Función para cargar la plantilla y generar el archivo modificado
export const generateAnexo = async (formData) => {
    try {

        // Cargar el archivo de plantilla
        const response = await fetch("/anexoplantilla.docx");
        const arrayBuffer = await response.arrayBuffer();
        
        // Cargar el contenido en PizZip
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });  

        // Filtrar tractoras vacías
        const tractorasFiltradas = formData.camiones.filter(t => t.matriculaRemolque);

        const totalkilos = formData.camiones.reduce((total, camion) => total + parseFloat(camion.kilos || 0), 0)
        const totalpacas = formData.camiones.reduce((total, camion) => total + parseFloat(camion.numeroBultos || 0), 0)

        const [year, month, day] = formData.fechaFactura.split("-");
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const mesEscrito = meses[parseInt(month, 10) - 1];
       

        // Rellenar datos en el documento
        doc.render({ camiones: tractorasFiltradas, factura: formData.numeroFactura, pesototal: totalkilos, pacas: totalpacas, dia: day, mes: mesEscrito});

        // Generar el archivo Word
        const output = doc.getZip().generate({ type: "blob" });

        // Descargar el documento
        saveAs(output, `ANEXO F${formData.numeroFactura} ${formData.cliente}.docx`);
    } catch (error) {
        console.error("Error generando el documento:", error);
    }   
};