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
    const detalles = await obtener('/desgloses-venta');
    const pagos = await obtener('/pagos');

    const totalPorVenta = new Map();

    for (const detalle of detalles) {

        const idVenta = Number(detalle.ID_VEN);
        const subtotal = Number(detalle.SUBTOTAL_DES_VEN);

        totalPorVenta.set(
            idVenta,
            (totalPorVenta.get(idVenta) || 0) + subtotal
        );
    }

    const pagadoPorVenta = new Map();

    for (const pago of pagos) {

        const idVenta = Number(pago.ID_VEN);
        const monto = Number(pago.MONTO_PAG);

        pagadoPorVenta.set(
            idVenta,
            (pagadoPorVenta.get(idVenta) || 0) + monto
        );
    }

    for (const venta of ventas) {

        // Estado 1 = REGISTRADA
        if (Number(venta.ID_ES_VEN) !== 1) {
            continue;
        }

        const idVenta = Number(venta.ID_VEN);

        const total = Number(
            (totalPorVenta.get(idVenta) || 0).toFixed(2)
        );

        const pagado = Number(
            (pagadoPorVenta.get(idVenta) || 0).toFixed(2)
        );

        if (total <= 0 || pagado !== 0) {
            continue;
        }

        const primerPago =
            Number((total / 2).toFixed(2));

        const segundoPago =
            Number((total - primerPago).toFixed(2));

        console.log(
            '=========================================='
        );

        console.log(
            'CASO PARA TRIGGER - COMPLETAR PAGO'
        );

        console.log(
            '==========================================\n'
        );

        console.log(`Venta: ${idVenta}`);
        console.log(`Estado actual: ${venta.ID_ES_VEN}`);
        console.log(`Total de venta: ${total}`);
        console.log(`Total pagado actualmente: ${pagado}`);

        console.log('\nPRIMER PAGO:');

        console.log(
            JSON.stringify(
                {
                    ID_PAG: 9998,
                    MONTO_PAG: primerPago,
                    ID_MET_PAG: 1,
                    ID_VEN: idVenta
                },
                null,
                4
            )
        );

        console.log('\nSEGUNDO PAGO:');

        console.log(
            JSON.stringify(
                {
                    ID_PAG: 9999,
                    MONTO_PAG: segundoPago,
                    ID_MET_PAG: 1,
                    ID_VEN: idVenta
                },
                null,
                4
            )
        );

        console.log(
            '\nDespues del primer pago debe continuar REGISTRADA.'
        );

        console.log(
            'Despues del segundo pago debe cambiar automaticamente a PAGADA.'
        );

        return;
    }

    console.log(
        'No se encontro una venta REGISTRADA sin pagos.'
    );
}

buscarCaso().catch(error => {
    console.error('Error:', error.message);
});