const XLSX = require('xlsx');
const path = require('path');

const API = 'http://localhost:3000/api';

const archivoExcel = path.join(
    __dirname,
    '..',
    'data',
    'dataset_comercial_la_estrella.xlsx'
);

async function verificarEstadosVentas() {

    const workbook = XLSX.readFile(archivoExcel);

    const ventasExcel = XLSX.utils.sheet_to_json(
        workbook.Sheets['VENTA'],
        { defval: null }
    );

    const respuesta = await fetch(
        `${API}/ventas`
    );

    if (!respuesta.ok) {
        throw new Error(
            `Error HTTP ${respuesta.status}`
        );
    }

    const ventasAPI = await respuesta.json();

    const mapaAPI = new Map();

    for (const venta of ventasAPI) {

        mapaAPI.set(
            Number(venta.ID_VEN),
            Number(venta.ID_ES_VEN)
        );
    }

    let correctas = 0;
    let diferencias = 0;

    const conteoExcel = {};
    const conteoAPI = {};

    console.log(
        '=========================================='
    );

    console.log(
        'VERIFICACION DE ESTADOS DE VENTA'
    );

    console.log(
        '==========================================\n'
    );

    for (const venta of ventasExcel) {

        const idVenta =
            Number(venta.ID_VEN);

        const estadoEsperado =
            Number(venta.ID_ES_VEN);

        const estadoActual =
            mapaAPI.get(idVenta);

        conteoExcel[estadoEsperado] =
            (conteoExcel[estadoEsperado] || 0) + 1;

        conteoAPI[estadoActual] =
            (conteoAPI[estadoActual] || 0) + 1;

        if (estadoActual === estadoEsperado) {

            correctas++;

        } else {

            diferencias++;

            console.log(
                `DIFERENCIA Venta ${idVenta}: Excel=${estadoEsperado}, API=${estadoActual}`
            );
        }
    }

    console.log('\n------------------------------------------');

    console.log(
        `Ventas correctas: ${correctas}`
    );

    console.log(
        `Diferencias: ${diferencias}`
    );

    console.log(
        `Total revisado: ${ventasExcel.length}`
    );

    console.log('\nEstados en Excel:');
    console.log(conteoExcel);

    console.log('\nEstados en API:');
    console.log(conteoAPI);

    console.log(
        '------------------------------------------'
    );

    if (
        diferencias === 0 &&
        correctas === ventasExcel.length
    ) {

        console.log(
            '\nESTADOS DE VENTA VERIFICADOS CORRECTAMENTE ✅'
        );

    } else {

        console.log(
            '\nSE ENCONTRARON DIFERENCIAS ❌'
        );
    }
}

verificarEstadosVentas()
    .catch(error => {

        console.error(
            'Error:',
            error.message
        );
    });