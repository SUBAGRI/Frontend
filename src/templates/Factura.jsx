import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const clientesData = {
    "STE VOYAGE BOUHAOUI": [
      "STE VOYAGE BOUHAOUI",
      "QUARTIER EL AMAL",
      "RUE ABOU ALLA Nº 337",
      "ICE: 002651001000049",
    ],
    "STE PROJ FRIO SARL": [
      "STE PROJ FRIO SARL",
      "AIN KAICHER, BEJAAD",
      "25050 MARRUECOS",
      "ICE: 002605622000075",
    ],
    "ALF SMARA": [
      "ALF SMARA",
      "RC:69267",
      "AV. SAID DAOUDI LOT 10, RES. OUMNIA BUREAU 3",
      "14000 KENITRA, MARRUECOS",
      "ICE:003293122000077",
    ],
    "THANKS GLOBAL": [
      "THANKS GLOBAL",
      "12 RUE SARIA BEN ZOUNAIM ETG 3 APT 3",
      "PALMIER CHEZ CA MERYAMA. 20430 CASABLANCA.MAROC",
      "ICE:003463311000058",
    ],
    "SOCIETE FRERES CHERGUIA": [
      "SOCIETE FRERES CHERGUIA",
      "QUARTIER DOUNIA II OULED TEIMA TAROUDANT",
      "MARRUECOS",
      "ICE: 003181192000055",
    ],
    "LYAQOUTI AGRO SARL": [
      "LYAQOUTI AGRO SARL",
      "2EGHMARATECOMMUNE CHAAIBATE CERCLE S IDI",
      "CP 5692 BIRANZARANE-EL JADIDA - MARRUECO",
      "ICE: 003507328000043",
    ],
    "SOCIETE INES Y HENOS SARL AU": [
      "SOCIETE INES Y HENOS SARL AU",
      "DOUAR LAKHMAISS EL KOLEAT AIT MELLOUL",
      "LQLIAA-TANGER-MARRUECOS",
      "47245041-M",
      "ICE: 002605084000051",
    ],
  };

export const ModifyExcel = async ( formData ) => {
        // 1. Cargar la plantilla desde public/
        const response = await fetch("/plantilla.xlsx");
        const arrayBuffer = await response.arrayBuffer();

        // 2. Crear un nuevo workbook y cargar el archivo
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        // 3. Seleccionar la hoja (puedes cambiar el índice si es necesario)
        const worksheet = workbook.worksheets[0];

        // 4. Modificar celdas sin perder formatos
        // Fecha
        const cellC10 = worksheet.getCell("C10");
        cellC10.value = formData.fechaFactura; // Modificar contenido
        cellC10.font = { bold: true };

        //N Factura
        const cellC11 = worksheet.getCell("C11");
        cellC11.value = '2025/' + formData.numeroFactura;
        cellC11.font = { bold: true };

        //Cliente
        const clientData = clientesData[formData.cliente];

        clientData.forEach((fila, index) => {
            const cell = worksheet.getCell(`C${13 + index}`); // Comienza en C14
            cell.value = fila;
            cell.font = { bold: true }; // Opcional: puedes hacer cada fila en negrita
          });

        //Pesos
        const cellB24 =worksheet.getCell("B24");
        cellB24.value = formData.camiones[0].kilos/1000;

        //Carga
        const cellC24 = worksheet.getCell("C24");
        cellC24.value = 'TN PAJA DE TRIGO PRENSADA ' + formData.tipoPaja.toUpperCase();

        //Matriculas
        const cellC25 = worksheet.getCell("C25");
        cellC25.value = 'MATRICULA ' +  formData.camiones[0].matriculaTractora + ' REMOLQUE ' + formData.camiones[0].matriculaRemolque
        

        // 6. Guardar el archivo modificado y descargarlo
        const blob = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([blob]), "F" + formData.numeroFactura + ' ' + formData.cliente);
    };