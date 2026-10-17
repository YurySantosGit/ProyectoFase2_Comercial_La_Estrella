const API = 'http://localhost:3000/api';

const tablas = [
    ['PAIS', '/paises', 3],
    ['TIPO_TIENDA', '/tipos-tienda', 4],
    ['TIPO_IDENTIFICACION', '/tipos-identificacion', 3],
    ['CARGO', '/cargos', 4],
    ['CATEGORIA', '/categorias', 10],
    ['MARCA', '/marcas', 15],
    ['ESTADO_VENTA', '/estados-venta', 3],
    ['METODO_PAGO', '/metodos-pago', 4],
    ['DEPARTAMENTO', '/departamentos', 32],
    ['MUNICIPIO', '/municipios', 80],
    ['PERSONA', '/personas', 388],
    ['TIENDA', '/tiendas', 20],
    ['EMPLEADO', '/empleados', 88],
    ['CLIENTE', '/clientes', 300],
    ['PRODUCTO', '/productos', 114],
    ['CATALOGO_PRODUCTO', '/catalogo-productos', 1424],
    ['VENTA', '/ventas', 1500],
    ['DESGLOSE_VENTA', '/desgloses-venta', 3687],
    ['PAGO', '/pagos', 1389]
];

async function verificar() {

    console.log('==========================================');
    console.log('VERIFICACION DE CARGA');
    console.log('==========================================\n');

    let total = 0;
    let correcto = true;

    for (const [nombre, endpoint, esperado] of tablas) {

        const respuesta = await fetch(`${API}${endpoint}`);

        if (!respuesta.ok) {
            console.log(
                `${nombre}: ERROR HTTP ${respuesta.status}`
            );

            correcto = false;
            continue;
        }

        const datos = await respuesta.json();

        const cantidad = datos.length;

        total += cantidad;

        const estado =
            cantidad === esperado ? 'OK' : 'ERROR';

        if (cantidad !== esperado) {
            correcto = false;
        }

        console.log(
            `${nombre.padEnd(22)} ${String(cantidad).padStart(4)} / ${String(esperado).padStart(4)}  ${estado}`
        );
    }

    console.log('\n------------------------------------------');
    console.log(`TOTAL EN API: ${total}`);
    console.log('TOTAL ESPERADO: 9068');
    console.log('------------------------------------------');

    if (correcto && total === 9068) {
        console.log('\nCARGA VERIFICADA CORRECTAMENTE ✅');
    } else {
        console.log('\nSE ENCONTRARON DIFERENCIAS ❌');
    }
}

verificar().catch(error => {
    console.error('Error:', error.message);
});