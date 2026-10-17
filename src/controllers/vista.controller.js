const { poolPromise } = require('../config/database');

const obtenerVentasUbicacion = async (req, res) => {
    try {
        const pool = await poolPromise;

        const resultado = await pool.request().query(`
            SELECT *
            FROM dbo.Vista_Ventas_Ubicacion
        `);

        res.json(resultado.recordset);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al consultar Vista_Ventas_Ubicacion',
            error: error.message
        });
    }
};

const obtenerTopProductos = async (req, res) => {
    try {
        const pool = await poolPromise;

        const resultado = await pool.request().query(`
            SELECT *
            FROM dbo.Vista_Top_Productos
        `);

        res.json(resultado.recordset);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al consultar Vista_Top_Productos',
            error: error.message
        });
    }
};

const obtenerSaldosPendientes = async (req, res) => {
    try {
        const pool = await poolPromise;

        const resultado = await pool.request().query(`
            SELECT *
            FROM dbo.Vista_Saldos_Pendientes
        `);

        res.json(resultado.recordset);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al consultar Vista_Saldos_Pendientes',
            error: error.message
        });
    }
};

module.exports = {
    obtenerVentasUbicacion,
    obtenerTopProductos,
    obtenerSaldosPendientes
};