const { sql, poolPromise } = require('../config/database');

const obtenerEstadosVenta = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_ES_VEN,
                NOMBRE_ES_VEN
            FROM dbo.ESTADO_VENTA
            ORDER BY ID_ES_VEN;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los estados de venta',
            error: error.message
        });
    }
};


const obtenerEstadoVentaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_ES_VEN,
                    NOMBRE_ES_VEN
                FROM dbo.ESTADO_VENTA
                WHERE ID_ES_VEN = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Estado de venta no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el estado de venta',
            error: error.message
        });
    }
};


const crearEstadoVenta = async (req, res) => {
    try {
        const {
            ID_ES_VEN,
            NOMBRE_ES_VEN
        } = req.body;

        if (ID_ES_VEN === undefined || !NOMBRE_ES_VEN) {
            return res.status(400).json({
                mensaje: 'ID_ES_VEN y NOMBRE_ES_VEN son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_ES_VEN)
            .input('nombre', sql.VarChar(30), NOMBRE_ES_VEN)
            .query(`
                INSERT INTO dbo.ESTADO_VENTA (
                    ID_ES_VEN,
                    NOMBRE_ES_VEN
                )
                VALUES (
                    @id,
                    @nombre
                );
            `);

        res.status(201).json({
            mensaje: 'Estado de venta creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el estado de venta',
            error: error.message
        });
    }
};


const actualizarEstadoVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE_ES_VEN } = req.body;

        if (!NOMBRE_ES_VEN) {
            return res.status(400).json({
                mensaje: 'NOMBRE_ES_VEN es obligatorio'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(30), NOMBRE_ES_VEN)
            .query(`
                UPDATE dbo.ESTADO_VENTA
                SET NOMBRE_ES_VEN = @nombre
                WHERE ID_ES_VEN = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Estado de venta no encontrado'
            });
        }

        res.json({
            mensaje: 'Estado de venta actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el estado de venta',
            error: error.message
        });
    }
};


const eliminarEstadoVenta = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.ESTADO_VENTA
                WHERE ID_ES_VEN = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Estado de venta no encontrado'
            });
        }

        res.json({
            mensaje: 'Estado de venta eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el estado de venta',
            error: error.message
        });
    }
};


module.exports = {
    obtenerEstadosVenta,
    obtenerEstadoVentaPorId,
    crearEstadoVenta,
    actualizarEstadoVenta,
    eliminarEstadoVenta
};