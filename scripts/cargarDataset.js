const XLSX = require('xlsx');
const path = require('path');

const API = 'http://localhost:3000/api';

const archivoExcel = path.join(
    __dirname,
    '..',
    'data',
    'dataset_comercial_la_estrella.xlsx'
);

const workbook = XLSX.readFile(archivoExcel);

// -----------------------------------------------------
// Utilidades
// -----------------------------------------------------

function obtenerDatos(nombreHoja) {
    return XLSX.utils.sheet_to_json(
        workbook.Sheets[nombreHoja],
        { defval: null }
    );
}

function convertirFechaExcel(valor) {

    if (valor === null || valor === undefined) {
        return null;
    }

    // Si ya viene como texto YYYY-MM-DD
    if (typeof valor === 'string') {
        return valor.substring(0, 10);
    }

    const fecha = XLSX.SSF.parse_date_code(valor);

    if (!fecha) {
        throw new Error(`Fecha Excel invalida: ${valor}`);
    }

    const y = String(fecha.y);
    const m = String(fecha.m).padStart(2, '0');
    const d = String(fecha.d).padStart(2, '0');

    return `${y}-${m}-${d}`;
}

async function enviarPOST(endpoint, registro) {

    const respuesta = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registro)
    });

    const texto = await respuesta.text();

    let contenido;

    try {
        contenido = JSON.parse(texto);
    } catch {
        contenido = texto;
    }

    if (!respuesta.ok) {

        console.error('\n====================================');
        console.error('ERROR DURANTE LA CARGA');
        console.error('====================================');

        console.error(`Endpoint: ${endpoint}`);
        console.error(`HTTP: ${respuesta.status}`);
        console.error('Registro:');
        console.error(registro);

        console.error('\nRespuesta:');
        console.error(contenido);

        throw new Error(
            `Carga detenida en ${endpoint}`
        );
    }
}

// -----------------------------------------------------
// Preparar informacion de inventario
// -----------------------------------------------------

function calcularVentasPorProductoYTienda() {

    const ventas =
        obtenerDatos('VENTA');

    const detalles =
        obtenerDatos('DESGLOSE_VENTA');

    const ventaTienda = new Map();

    for (const venta of ventas) {

        ventaTienda.set(
            Number(venta.ID_VEN),
            Number(venta.ID_TI)
        );
    }

    const cantidadesVendidas = new Map();

    for (const detalle of detalles) {

        const idVenta =
            Number(detalle.ID_VEN);

        const idProducto =
            Number(detalle.ID_PRO);

        const idTienda =
            ventaTienda.get(idVenta);

        if (idTienda === undefined) {
            throw new Error(
                `No se encontro tienda para venta ${idVenta}`
            );
        }

        const clave =
            `${idTienda}-${idProducto}`;

        const cantidadAnterior =
            cantidadesVendidas.get(clave) || 0;

        cantidadesVendidas.set(
            clave,
            cantidadAnterior +
            Number(detalle.CANTIDAD_DES_VEN)
        );
    }

    return cantidadesVendidas;
}

// -----------------------------------------------------
// Carga generica
// -----------------------------------------------------

async function cargarTabla(
    nombre,
    endpoint,
    transformar = registro => registro
) {

    const datos =
        obtenerDatos(nombre);

    console.log(
        `\nCargando ${nombre} (${datos.length} registros)...`
    );

    let cargados = 0;

    for (const registroOriginal of datos) {

        const registro =
            transformar({ ...registroOriginal });

        await enviarPOST(
            endpoint,
            registro
        );

        cargados++;

        if (
            cargados % 100 === 0 ||
            cargados === datos.length
        ) {
            console.log(
                `  ${cargados}/${datos.length}`
            );
        }
    }

    console.log(
        `${nombre} completada.`
    );
}

// -----------------------------------------------------
// Proceso principal
// -----------------------------------------------------

async function cargarDataset() {

    console.log(
        '=========================================='
    );

    console.log(
        'CARGA MASIVA - COMERCIAL LA ESTRELLA'
    );

    console.log(
        '=========================================='
    );

    console.log(`API: ${API}`);
    console.log(`Excel: ${archivoExcel}`);

    const cantidadesVendidas =
        calcularVentasPorProductoYTienda();

    // 1
    await cargarTabla(
        'PAIS',
        '/paises'
    );

    // 2
    await cargarTabla(
        'TIPO_TIENDA',
        '/tipos-tienda'
    );

    // 3
    await cargarTabla(
        'TIPO_IDENTIFICACION',
        '/tipos-identificacion'
    );

    // 4
    await cargarTabla(
        'CARGO',
        '/cargos'
    );

    // 5
    await cargarTabla(
        'CATEGORIA',
        '/categorias'
    );

    // 6
    await cargarTabla(
        'MARCA',
        '/marcas'
    );

    // 7
    await cargarTabla(
        'ESTADO_VENTA',
        '/estados-venta'
    );

    // 8
    await cargarTabla(
        'METODO_PAGO',
        '/metodos-pago'
    );

    // 9
    await cargarTabla(
        'DEPARTAMENTO',
        '/departamentos'
    );

    // 10
    await cargarTabla(
        'MUNICIPIO',
        '/municipios'
    );

    // 11
    await cargarTabla(
        'PERSONA',
        '/personas'
    );

    // 12
    await cargarTabla(
        'TIENDA',
        '/tiendas'
    );

    // 13
    await cargarTabla(
        'EMPLEADO',
        '/empleados',
        registro => {

            registro.FECHA_CONTRATACION =
                convertirFechaExcel(
                    registro.FECHA_CONTRATACION
                );

            return registro;
        }
    );

    // 14
    await cargarTabla(
        'CLIENTE',
        '/clientes',
        registro => {

            registro.NUMERO_IDENTIFICACION =
                String(
                    registro.NUMERO_IDENTIFICACION
                );

            return registro;
        }
    );

    // 15
    await cargarTabla(
        'PRODUCTO',
        '/productos'
    );

    // 16
    // Se suma la cantidad historicamente vendida
    // para que el trigger Insert_Detalle deje al final
    // exactamente el stock contenido en el dataset.
    await cargarTabla(
        'CATALOGO_PRODUCTO',
        '/catalogo-productos',
        registro => {

            const clave =
                `${Number(registro.ID_TI)}-${Number(registro.ID_PRO)}`;

            const vendido =
                cantidadesVendidas.get(clave) || 0;

            registro.EXISTENCIA_ACTUAL_CAT_PRO =
                Number(
                    registro.EXISTENCIA_ACTUAL_CAT_PRO
                ) + vendido;

            return registro;
        }
    );

    // 17
    await cargarTabla(
        'VENTA',
        '/ventas',
        registro => {

            registro.FECHA_VEN =
                convertirFechaExcel(
                    registro.FECHA_VEN
                );

            return registro;
        }
    );

    // 18
    // Aqui se ejecuta Insert_Detalle y descuenta
    // automaticamente el inventario.
    await cargarTabla(
        'DESGLOSE_VENTA',
        '/desgloses-venta'
    );

    // 19
    // Aqui se ejecuta Insert_Pago.
    await cargarTabla(
        'PAGO',
        '/pagos'
    );

    console.log('\n==========================================');
    console.log('CARGA COMPLETADA CORRECTAMENTE');
    console.log('==========================================');

    console.log(
        'Total esperado: 9068 registros'
    );
}

cargarDataset()
    .then(() => {
        process.exit(0);
    })
    .catch(error => {

        console.error('\nCARGA CANCELADA.');

        console.error(
            error.message
        );

        process.exit(1);
    });