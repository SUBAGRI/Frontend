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
    "FREPASCO": [
      "FREPASCO SARL",
      "82 RUE SOUMAYA 4EME ETG N16",
      "CASABLANCA",
      "25050 MARRUECOS",
      "ICE: 002543267000031",
    ]
  };

export const DescargarPacking = async ( formData ) => {

    const cliente = formData.cliente;

    const [year, month, day] = formData.fechaFactura.split("-");
    const fechaFormateada = `${day}/${month}/${year}`;

    // Fecha en formato 280325
    const fechaArchivo = `${day}${month}${year.slice(2)}`;
    const nombreArchivo = `PACKING F${formData.numeroFactura} ${formData.cliente} ${fechaArchivo}.xlsx`;

    const response = await fetch("/plantillapackinglist.xlsx");

    const arrayBuffer = await response.arrayBuffer();
    
    // 2. Crear un nuevo workbook y cargar el archivo
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    
    let worksheet
    worksheet = workbook.worksheets[formData.numeroCamiones-1];
    worksheet.name = `${formData.cliente} F${formData.numeroFactura}`;

    // Fecha
    const cellB21 = worksheet.getCell("B21");
    cellB21.value = fechaFormateada; // Modificar contenido
    cellB21.font = { bold: true };

    //N Factura
    const cellB22 = worksheet.getCell("B22");
    cellB22.value = '2025/' + formData.numeroFactura;
    cellB22.font = { bold: true };

    //Cliente
    const clientData = clientesData[cliente];

    clientData.forEach((fila, index) => {
        const cell = worksheet.getCell(`D${12 + index}`); // Comienza en C14
        cell.value = fila;
        cell.font = { bold: true }; // Opcional: puedes hacer cada fila en negrita
      });

      formData.camiones.forEach((camion, index) => {
        const tipo = camion.tipoPaja;
        const kilos = parseFloat(camion.kilos);
        const pacas = parseFloat(camion.numeroBultos);
      
        // Calcula el desplazamiento: empieza en la fila 24 y suma 2 por camión
        const rowBase = 24 + index;
      
        // pacas
        worksheet.getCell(`D${rowBase}`).value = pacas;
      
        // Peso
        worksheet.getCell(`E${rowBase}`).value = kilos;
        worksheet.getCell(`F${rowBase}`).value = kilos;
      
        // Matrículas
        worksheet.getCell(`G${rowBase}`).value = camion.matriculaRemolque;
      });

      // 5. Eliminar las otras hojas que no se usan
      workbook.worksheets.forEach((ws, index) => {
        if (index !== formData.numeroCamiones - 1) {
            workbook.removeWorksheet(ws);
        }
    });
    
    // 6. Guardar el archivo modificado y descargarlo
        const blob = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nombreArchivo);

}