import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// Función para cargar la plantilla y generar el archivo modificado
export const generateDocument = async () => {
    try {
        const tractoras = [
            { matricula: "ABC123", remolque: "XYZ789" },
            { matricula: "", remolque: "" },  // Esta línea será eliminada
            { matricula: "DEF456", remolque: "UVW987" },
            { matricula: "", remolque: "" }   // Esta línea será eliminada
        ]

        // Cargar el archivo de plantilla
        const response = await fetch("/humedadplantilla.docx");
        const arrayBuffer = await response.arrayBuffer();
        
        // Cargar el contenido en PizZip
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // Filtrar tractoras vacías
        const tractorasFiltradas = tractoras.filter(t => t.matricula && t.remolque);

        // Rellenar datos en el documento
        doc.render({ tractoras: tractorasFiltradas });

        // Generar el archivo Word
        const output = doc.getZip().generate({ type: "blob" });

        // Descargar el documento
        saveAs(output, "documento_generado.docx");
    } catch (error) {
        console.error("Error generando el documento:", error);
    }
};