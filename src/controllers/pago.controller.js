const { sql, poolPromise } = require('../config/database');

const obtenerPagos = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_PAG,
                MONTO_PAG,
                ID_MET_PAG,
                ID_VEN
            FROM dbo.PAGO
            ORDER BY ID_PAG;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los pagos',
            error: error.message
        });
    }
};


const obtenerPagoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_PAG,
                    MONTO_PAG,
                    ID_MET_PAG,
                    ID_VEN
                FROM dbo.PAGO
                WHERE ID_PAG = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Pago no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el pago',
            error: error.message
        });
    }
};


const crearPago = async (req, res) => {
    try {
        const {
            ID_PAG,
            MONTO_PAG,
            ID_MET_PAG,
            ID_VEN
        } = req.body;

        if (
            ID_PAG === undefined ||
            MONTO_PAG === undefined ||
            ID_MET_PAG === undefined ||
            ID_VEN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_PAG)
            .input('monto', sql.Decimal(12, 2), MONTO_PAG)
            .input('idMetodoPago', sql.Int, ID_MET_PAG)
            .input('idVenta', sql.Int, ID_VEN)
            .query(`
                INSERT INTO dbo.PAGO (
                    ID_PAG,
                    MONTO_PAG,
                    ID_MET_PAG,
                    ID_VEN
                )
                VALUES (
                    @id,
                    @monto,
                    @idMetodoPago,
                    @idVenta
                );
            `);

        res.status(201).json({
            mensaje: 'Pago creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el pago',
            error: error.message
        });
    }
};


const actualizarPago = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            MONTO_PAG,
            ID_MET_PAG,
            ID_VEN
        } = req.body;

        if (
            MONTO_PAG === undefined ||
            ID_MET_PAG === undefined ||
            ID_VEN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('monto', sql.Decimal(12, 2), MONTO_PAG)
            .input('idMetodoPago', sql.Int, ID_MET_PAG)
            .input('idVenta', sql.Int, ID_VEN)
            .query(`
                UPDATE dbo.PAGO
                SET
                    MONTO_PAG = @monto,
                    ID_MET_PAG = @idMetodoPago,
                    ID_VEN = @idVenta
                WHERE ID_PAG = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Pago no encontrado'
            });
        }

        res.json({
            mensaje: 'Pago actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el pago',
            error: error.message
        });
    }
};


const eliminarPago = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.PAGO
                WHERE ID_PAG = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Pago no encontrado'
            });
        }

        res.json({
            mensaje: 'Pago eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el pago',
            error: error.message
        });
    }
};


module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago,
    actualizarPago,
    eliminarPago
};