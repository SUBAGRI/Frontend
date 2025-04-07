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

  const preciosPorClienteYTipo = {
    "STE PROJ FRIO SARL": {
      "Paquete pequeño": 140,
      "Heno de avena": 180,
      "Imabe": 110,
      "Jovisa": 110,
      "Guisante": 140,
    },
    "THANKS GLOBAL": {
      "Jovisa": 110,
      "Imabe": 112,
      "Paquete pequeño": 140,
      "Heno de avena": 200,
      "Guisante": 140,
    },
    "SOCIETE FRERES CHERGUIA": {
      "Jovisa": 110,
      "Imabe": 114,
      "Heno de avena": 190,
      "Guisante": 140,
      "Paquete pequeño": 140,
    },
    "STE VOYAGE BOUHAOUI": {
      "Guisante": 140,
      "Paquete pequeño": 140,
      "Imabe": 107,
      "Jovisa": 107,
      "Heno de avena": 180,
    },
    "ALF SMARA": {
      "Heno de avena": 190,
      "Jovisa": 120,
      "Imabe": 120,
      "Guisante": 140,
      "Paquete pequeño": 140,
    },
    "SOCIETE INES Y HENOS SARL AU": {
      "Imabe": 120,
      "Jovisa": 120,
      "Guisante": 145,
      "Paquete pequeño": 145,
      "Heno de avena": 200,
    },
    "LYAQOUTI AGRO SARL": {
      "Imabe": 120,
      "Jovisa": 120,
      "Guisante": 145,
      "Paquete pequeño": 145,
      "Heno de avena": 200,
    }
  };

export const ModifyExcel = async ( formData ) => {

        const cliente = formData.cliente;

        const [year, month, day] = formData.fechaFactura.split("-");
        const fechaFormateada = `${day}/${month}/${year}`;

        // Fecha en formato 280325
        const fechaArchivo = `${day}${month}${year.slice(2)}`;
        const nombreArchivo = `F${formData.numeroFactura} ${formData.cliente} ${fechaArchivo}.xlsx`;

        // 1. Cargar la plantilla desde public/
        let response;
        if (cliente === 'SOCIETE INES Y HENOS SARL AU' || cliente === 'LYAQOUTI AGRO SARL') {
            response = await fetch("/plantillainesyhenos.xlsx")
        } else {
            response = await fetch("/plantilla.xlsx");
        }

        const arrayBuffer = await response.arrayBuffer();

        // 2. Crear un nuevo workbook y cargar el archivo
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        
        let worksheet
        // 3. Seleccionar la hoja (puedes cambiar el índice si es necesario)
        worksheet = workbook.worksheets[formData.numeroCamiones-1];
        worksheet.name = `${formData.cliente} F${formData.numeroFactura}`;

        // 4. Modificar celdas sin perder formatos
        // Fecha
        const cellC10 = worksheet.getCell("C10");
        cellC10.value = fechaFormateada; // Modificar contenido
        cellC10.font = { bold: true };

        //N Factura
        const cellC11 = worksheet.getCell("C11");
        cellC11.value = '2025/' + formData.numeroFactura;
        cellC11.font = { bold: true };

        //Cliente
        const clientData = clientesData[cliente];
        let modelo046row = 27

        clientData.forEach((fila, index) => {
            const cell = worksheet.getCell(`C${13 + index}`); // Comienza en C14
            cell.value = fila;
            cell.font = { bold: true }; // Opcional: puedes hacer cada fila en negrita
          });

          formData.camiones.forEach((camion, index) => {
            const tipo = camion.tipoPaja;
            const kilos = parseFloat(camion.kilos);
            const precio = preciosPorClienteYTipo[cliente]?.[tipo] || 0;
          
            // Calcula el desplazamiento: empieza en la fila 24 y suma 2 por camión
            const rowBase = 24 + index * 2;
          
            // Pesos
            worksheet.getCell(`B${rowBase}`).value = kilos / 1000;
          
            // Carga
            const cellCarga = worksheet.getCell(`C${rowBase}`);
            if (tipo === 'Heno de avena') {
              cellCarga.value = 'TN DE ' + tipo.toUpperCase();
            } else if (tipo === 'Guisante') {
              cellCarga.value = 'TN PAJA DE ' + tipo.toUpperCase() + ' PRENSADA';
            } else {
              cellCarga.value = 'TN PAJA DE TRIGO PRENSADA ' + tipo.toUpperCase();
            }
          
            // Matrículas
            worksheet.getCell(`C${rowBase + 1}`).value =
              'MATRICULA ' + camion.matriculaTractora + ' REMOLQUE ' + camion.matriculaRemolque;
          
            // Precio
            const precioFinal = formData.facturaReal === 'no' ? 80 : precio;
            worksheet.getCell(`F${rowBase}`).value = precioFinal;

            modelo046row = rowBase + 2
          });

        //Ponemos el modelo 046 si es necesario
        if (formData.facturaReal === 'no') {

        } else {
          worksheet.getCell(`B${modelo046row}`).value = 1
          worksheet.getCell(`C${modelo046row}`).value = 'TASAS MODELO 046'
          worksheet.getCell(`F${modelo046row}`).value = 26.33
          worksheet.getCell(`G${modelo046row}`).value = 26.33
        }

         // 5. Eliminar las otras hojas que no se usan
          workbook.worksheets.forEach((ws, index) => {
            if (index !== formData.numeroCamiones - 1) {
                workbook.removeWorksheet(ws);
            }
        });

        // 6. Guardar el archivo modificado y descargarlo
        const blob = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nombreArchivo);
    };