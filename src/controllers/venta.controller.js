const { sql, poolPromise } = require('../config/database');

const obtenerVentas = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_VEN,
                FECHA_VEN,
                ID_TI,
                ID_EMP,
                ID_CLI,
                ID_ES_VEN
            FROM dbo.VENTA
            ORDER BY ID_VEN;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las ventas',
            error: error.message
        });
    }
};


const obtenerVentaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    v.ID_VEN,
                    v.FECHA_VEN,
                    v.ID_TI,
                    v.ID_EMP,
                    v.ID_CLI,
                    v.ID_ES_VEN,
                    ev.NOMBRE_ES_VEN AS ESTADO_VENTA
                FROM dbo.VENTA v
                INNER JOIN dbo.ESTADO_VENTA ev
                    ON v.ID_ES_VEN = ev.ID_ES_VEN
                WHERE v.ID_VEN = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Venta no encontrada'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la venta',
            error: error.message
        });
    }
};


const crearVenta = async (req, res) => {
    try {
        const {
            ID_VEN,
            FECHA_VEN,
            ID_TI,
            ID_EMP,
            ID_CLI,
            ID_ES_VEN
        } = req.body;

        if (
            ID_VEN === undefined ||
            !FECHA_VEN ||
            ID_TI === undefined ||
            ID_EMP === undefined ||
            ID_CLI === undefined ||
            ID_ES_VEN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_VEN)
            .input('fecha', sql.Date, FECHA_VEN)
            .input('idTienda', sql.Int, ID_TI)
            .input('idEmpleado', sql.Int, ID_EMP)
            .input('idCliente', sql.Int, ID_CLI)
            .input('idEstadoVenta', sql.Int, ID_ES_VEN)
            .query(`
                INSERT INTO dbo.VENTA (
                    ID_VEN,
                    FECHA_VEN,
                    ID_TI,
                    ID_EMP,
                    ID_CLI,
                    ID_ES_VEN
                )
                VALUES (
                    @id,
                    @fecha,
                    @idTienda,
                    @idEmpleado,
                    @idCliente,
                    @idEstadoVenta
                );
            `);

        res.status(201).json({
            mensaje: 'Venta creada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la venta',
            error: error.message
        });
    }
};


const actualizarVenta = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            FECHA_VEN,
            ID_TI,
            ID_EMP,
            ID_CLI,
            ID_ES_VEN
        } = req.body;

        if (
            !FECHA_VEN ||
            ID_TI === undefined ||
            ID_EMP === undefined ||
            ID_CLI === undefined ||
            ID_ES_VEN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('fecha', sql.Date, FECHA_VEN)
            .input('idTienda', sql.Int, ID_TI)
            .input('idEmpleado', sql.Int, ID_EMP)
            .input('idCliente', sql.Int, ID_CLI)
            .input('idEstadoVenta', sql.Int, ID_ES_VEN)
            .query(`
                UPDATE dbo.VENTA
                SET
                    FECHA_VEN = @fecha,
                    ID_TI = @idTienda,
                    ID_EMP = @idEmpleado,
                    ID_CLI = @idCliente,
                    ID_ES_VEN = @idEstadoVenta
                WHERE ID_VEN = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Venta no encontrada'
            });
        }

        res.json({
            mensaje: 'Venta actualizada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la venta',
            error: error.message
        });
    }
};


const eliminarVenta = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.VENTA
                WHERE ID_VEN = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Venta no encontrada'
            });
        }

        res.json({
            mensaje: 'Venta eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la venta',
            error: error.message
        });
    }
};


module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    actualizarVenta,
    eliminarVenta
};