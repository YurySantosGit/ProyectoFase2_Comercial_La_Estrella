require('dotenv').config();

const tipoTiendaRoutes = require('./routes/tipoTienda.routes');
const paisRoutes = require('./routes/pais.routes');
const tipoIdentificacionRoutes = require('./routes/tipoIdentificacion.routes');
const cargoRoutes = require('./routes/cargo.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const marcaRoutes = require('./routes/marca.routes');
const estadoVentaRoutes = require('./routes/estadoVenta.routes');
const metodoPagoRoutes = require('./routes/metodoPago.routes');
const departamentoRoutes = require('./routes/departamento.routes');
const municipioRoutes = require('./routes/municipio.routes');
const personaRoutes = require('./routes/persona.routes');
const tiendaRoutes = require('./routes/tienda.routes');
const empleadoRoutes = require('./routes/empleado.routes');
const clienteRoutes = require('./routes/cliente.routes');
const productoRoutes = require('./routes/producto.routes');
const catalogoProductoRoutes = require('./routes/catalogoProducto.routes');
const ventaRoutes = require('./routes/venta.routes');
const desgloseVentaRoutes = require('./routes/desgloseVenta.routes');
const pagoRoutes = require('./routes/pago.routes');
const vistaRoutes = require('./routes/vista.routes');

const express = require('express');
const cors = require('cors');

const { poolPromise } = require('./config/database');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/paises', paisRoutes);
app.use('/api/tipos-tienda', tipoTiendaRoutes);
app.use('/api/tipos-identificacion', tipoIdentificacionRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/estados-venta', estadoVentaRoutes);
app.use('/api/metodos-pago', metodoPagoRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/municipios', municipioRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/tiendas', tiendaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/catalogo-productos', catalogoProductoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/desgloses-venta', desgloseVentaRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/vistas', vistaRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API Comercial La Estrella funcionando correctamente'
    });
});


app.get('/api/test-db', async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                DB_NAME() AS base_datos,
                COUNT(*) AS total_tablas
            FROM sys.tables;
        `);

        res.json({
            mensaje: 'Conexión con SQL Server correcta',
            base_datos: result.recordset[0].base_datos,
            total_tablas: result.recordset[0].total_tablas
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al conectar con SQL Server',
            error: error.message
        });

    }

});


app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});