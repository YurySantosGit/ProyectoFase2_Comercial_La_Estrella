const API = 'http://localhost:3000/api';

async function obtener(endpoint) {
    const respuesta = await fetch(`${API}${endpoint}`);

    if (!respuesta.ok) {
        throw new Error(
            `Error HTTP ${respuesta.status} consultando ${endpoint}`
        );
    }

    return respuesta.json();
}

async function buscarCaso() {

    const ventas = await obtener('/ventas');
    const catalogo = await obtener('/catalogo-productos');
    const detalles = await obtener('/desgloses-venta');

    // Productos que ya existen dentro de cada venta
    const productosPorVenta = new Map();

    for (const detalle of detalles) {

        const idVenta = Number(detalle.ID_VEN);
        const idProducto = Number(detalle.ID_PRO);

        if (!productosPorVenta.has(idVenta)) {
            productosPorVenta.set(idVenta, new Set());
        }

        productosPorVenta
            .get(idVenta)
            .add(idProducto);
    }

    for (const venta of ventas) {

        const idVenta = Number(venta.ID_VEN);
        const idTienda = Number(venta.ID_TI);

        const productosExistentes =
            productosPorVenta.get(idVenta) || new Set();

        const candidato = catalogo.find(item =>
            Number(item.ID_TI) === idTienda &&
            !productosExistentes.has(Number(item.ID_PRO))
        );

        if (!candidato) {
            continue;
        }

        const stock =
            Number(candidato.EXISTENCIA_ACTUAL_CAT_PRO);

        const precio =
            Number(candidato.PRECIO_VIGENTE_CAT_PRO);

        const cantidadSolicitada =
            stock + 1;

        const subtotal =
            Number(
                (cantidadSolicitada * precio).toFixed(2)
            );

        console.log(
            '=========================================='
        );

        console.log(
            'CASO PARA TRIGGER - STOCK INSUFICIENTE'
        );

        console.log(
            '==========================================\n'
        );

        console.log(`Venta: ${idVenta}`);
        console.log(`Tienda: ${idTienda}`);
        console.log(`Producto: ${candidato.ID_PRO}`);
        console.log(`Stock actual: ${stock}`);
        console.log(`Precio: ${precio}`);

        console.log(
            `Cantidad a solicitar: ${cantidadSolicitada}`
        );

        console.log('\nBODY PARA POSTMAN:\n');

        console.log(
            JSON.stringify(
                {
                    CANTIDAD_DES_VEN:
                        cantidadSolicitada,

                    PRECIO_UNITARIO_DES_VEN:
                        precio,

                    SUBTOTAL_DES_VEN:
                        subtotal,

                    ID_VEN:
                        idVenta,

                    ID_PRO:
                        Number(candidato.ID_PRO)
                },
                null,
                4
            )
        );

        return;
    }

    console.log(
        'No se encontro un caso disponible.'
    );
}

buscarCaso().catch(error => {
    console.error('Error:', error.message);
});