const XLSX = require('xlsx');
const path = require('path');

const API = 'http://localhost:3000/api';

const archivoExcel = path.join(
    __dirname,
    '..',
    'data',
    'dataset_comercial_la_estrella.xlsx'
);

async function verificarInventario() {

    const workbook = XLSX.readFile(archivoExcel);

    const catalogoExcel = XLSX.utils.sheet_to_json(
        workbook.Sheets['CATALOGO_PRODUCTO'],
        { defval: null }
    );

    const respuesta = await fetch(
        `${API}/catalogo-productos`
    );

    if (!respuesta.ok) {
        throw new Error(
            `Error HTTP ${respuesta.status}`
        );
    }

    const catalogoAPI = await respuesta.json();

    const mapaAPI = new Map();

    for (const registro of catalogoAPI) {

        const clave =
            `${Number(registro.ID_TI)}-${Number(registro.ID_PRO)}`;

        mapaAPI.set(
            clave,
            Number(registro.EXISTENCIA_ACTUAL_CAT_PRO)
        );
    }

    let correctos = 0;
    let diferencias = 0;

    console.log(
        '=========================================='
    );

    console.log(
        'VERIFICACION DE INVENTARIO'
    );

    console.log(
        '==========================================\n'
    );

    for (const registro of catalogoExcel) {

        const clave =
            `${Number(registro.ID_TI)}-${Number(registro.ID_PRO)}`;

        const esperado =
            Number(registro.EXISTENCIA_ACTUAL_CAT_PRO);

        const actual =
            mapaAPI.get(clave);

        if (actual === esperado) {
            correctos++;
        } else {

            diferencias++;

            console.log(
                `DIFERENCIA ${clave}: Excel=${esperado}, API=${actual}`
            );
        }
    }

    console.log('\n------------------------------------------');

    console.log(
        `Registros correctos: ${correctos}`
    );

    console.log(
        `Diferencias: ${diferencias}`
    );

    console.log(
        `Total revisado: ${catalogoExcel.length}`
    );

    console.log(
        '------------------------------------------'
    );

    if (
        diferencias === 0 &&
        correctos === catalogoExcel.length
    ) {
        console.log(
            '\nINVENTARIO VERIFICADO CORRECTAMENTE ✅'
        );
    } else {
        console.log(
            '\nSE ENCONTRARON DIFERENCIAS ❌'
        );
    }
}

verificarInventario()
    .catch(error => {
        console.error(
            'Error:',
            error.message
        );
    });