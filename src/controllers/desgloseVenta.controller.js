const { sql, poolPromise } = require('../config/database');

const obtenerDesglosesVenta = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_VEN,
                ID_PRO,
                CANTIDAD_DES_VEN,
                PRECIO_UNITARIO_DES_VEN,
                SUBTOTAL_DES_VEN
            FROM dbo.DESGLOSE_VENTA
            ORDER BY ID_VEN, ID_PRO;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los desgloses de venta',
            error: error.message
        });
    }
};


const obtenerDesgloseVentaPorId = async (req, res) => {
    try {
        const { idVenta, idProducto } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('idVenta', sql.Int, idVenta)
            .input('idProducto', sql.Int, idProducto)
            .query(`
                SELECT
                    ID_VEN,
                    ID_PRO,
                    CANTIDAD_DES_VEN,
                    PRECIO_UNITARIO_DES_VEN,
                    SUBTOTAL_DES_VEN
                FROM dbo.DESGLOSE_VENTA
                WHERE ID_VEN = @idVenta
                  AND ID_PRO = @idProducto;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Desglose de venta no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el desglose de venta',
            error: error.message
        });
    }
};


const crearDesgloseVenta = async (req, res) => {
    try {
        const {
            ID_VEN,
            ID_PRO,
            CANTIDAD_DES_VEN,
            PRECIO_UNITARIO_DES_VEN,
            SUBTOTAL_DES_VEN
        } = req.body;

        if (
            ID_VEN === undefined ||
            ID_PRO === undefined ||
            CANTIDAD_DES_VEN === undefined ||
            PRECIO_UNITARIO_DES_VEN === undefined ||
            SUBTOTAL_DES_VEN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('idVenta', sql.Int, ID_VEN)
            .input('idProducto', sql.Int, ID_PRO)
            .input('cantidad', sql.Int, CANTIDAD_DES_VEN)
            .input('precio', sql.Decimal(10, 2), PRECIO_UNITARIO_DES_VEN)
            .input('subtotal', sql.Decimal(12, 2), SUBTOTAL_DES_VEN)
            .query(`
                INSERT INTO dbo.DESGLOSE_VENTA (
                    ID_VEN,
                    ID_PRO,
                    CANTIDAD_DES_VEN,
                    PRECIO_UNITARIO_DES_VEN,
                    SUBTOTAL_DES_VEN
                )
                VALUES (
                    @idVenta,
                    @idProducto,
                    @cantidad,
                    @precio,
                    @subtotal
                );
            `);

        res.status(201).json({
            mensaje: 'Desglose de venta creado correctamente'
        });

    } catch (error) {

        if (error.message.includes('Stock insuficiente')) {
            return res.status(400).json({
                mensaje: 'Stock insuficiente'
            });
        }

        res.status(500).json({
            mensaje: 'Error al crear el desglose de venta',
            error: error.message
        });
    }
};


const actualizarDesgloseVenta = async (req, res) => {
    try {
        const { idVenta, idProducto } = req.params;

        const {
            CANTIDAD_DES_VEN,
            PRECIO_UNITARIO_DES_VEN,
            SUBTOTAL_DES_VEN
        } = req.body;

        if (
            CANTIDAD_DES_VEN === undefined ||
            PRECIO_UNITARIO_DES_VEN === undefined ||
            SUBTOTAL_DES_VEN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('idVenta', sql.Int, idVenta)
            .input('idProducto', sql.Int, idProducto)
            .input('cantidad', sql.Int, CANTIDAD_DES_VEN)
            .input('precio', sql.Decimal(10, 2), PRECIO_UNITARIO_DES_VEN)
            .input('subtotal', sql.Decimal(12, 2), SUBTOTAL_DES_VEN)
            .query(`
                UPDATE dbo.DESGLOSE_VENTA
                SET
                    CANTIDAD_DES_VEN = @cantidad,
                    PRECIO_UNITARIO_DES_VEN = @precio,
                    SUBTOTAL_DES_VEN = @subtotal
                WHERE ID_VEN = @idVenta
                  AND ID_PRO = @idProducto;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Desglose de venta no encontrado'
            });
        }

        res.json({
            mensaje: 'Desglose de venta actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el desglose de venta',
            error: error.message
        });
    }
};


const eliminarDesgloseVenta = async (req, res) => {
    try {
        const { idVenta, idProducto } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('idVenta', sql.Int, idVenta)
            .input('idProducto', sql.Int, idProducto)
            .query(`
                DELETE FROM dbo.DESGLOSE_VENTA
                WHERE ID_VEN = @idVenta
                  AND ID_PRO = @idProducto;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Desglose de venta no encontrado'
            });
        }

        res.json({
            mensaje: 'Desglose de venta eliminado correctamente'
        });

        } catch (error) {

        const mensajesError = [
            error.message,
            ...(error.precedingErrors || []).map(err => err.message),
            error.originalError?.info?.message
        ]
            .filter(Boolean)
            .join(' | ');

        if (mensajesError.includes('Stock insuficiente')) {
            return res.status(400).json({
                mensaje: 'Stock insuficiente'
            });
        }

        res.status(500).json({
            mensaje: 'Error al crear el desglose de venta',
            error: mensajesError
        });
    }
};


module.exports = {
    obtenerDesglosesVenta,
    obtenerDesgloseVentaPorId,
    crearDesgloseVenta,
    actualizarDesgloseVenta,
    eliminarDesgloseVenta
};