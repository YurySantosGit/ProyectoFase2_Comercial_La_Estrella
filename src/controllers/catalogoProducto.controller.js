const { sql, poolPromise } = require('../config/database');

const obtenerCatalogoProductos = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_TI,
                ID_PRO,
                PRECIO_VIGENTE_CAT_PRO,
                EXISTENCIA_ACTUAL_CAT_PRO
            FROM dbo.CATALOGO_PRODUCTO
            ORDER BY ID_TI, ID_PRO;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el catalogo de productos',
            error: error.message
        });
    }
};


const obtenerCatalogoProductoPorId = async (req, res) => {
    try {
        const { idTienda, idProducto } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('idTienda', sql.Int, idTienda)
            .input('idProducto', sql.Int, idProducto)
            .query(`
                SELECT
                    ID_TI,
                    ID_PRO,
                    PRECIO_VIGENTE_CAT_PRO,
                    EXISTENCIA_ACTUAL_CAT_PRO
                FROM dbo.CATALOGO_PRODUCTO
                WHERE ID_TI = @idTienda
                  AND ID_PRO = @idProducto;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Producto de catalogo no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el producto de catalogo',
            error: error.message
        });
    }
};


const crearCatalogoProducto = async (req, res) => {
    try {
        const {
            ID_TI,
            ID_PRO,
            PRECIO_VIGENTE_CAT_PRO,
            EXISTENCIA_ACTUAL_CAT_PRO
        } = req.body;

        if (
            ID_TI === undefined ||
            ID_PRO === undefined ||
            PRECIO_VIGENTE_CAT_PRO === undefined ||
            EXISTENCIA_ACTUAL_CAT_PRO === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('idTienda', sql.Int, ID_TI)
            .input('idProducto', sql.Int, ID_PRO)
            .input('precio', sql.Decimal(10, 2), PRECIO_VIGENTE_CAT_PRO)
            .input('existencia', sql.Int, EXISTENCIA_ACTUAL_CAT_PRO)
            .query(`
                INSERT INTO dbo.CATALOGO_PRODUCTO (
                    ID_TI,
                    ID_PRO,
                    PRECIO_VIGENTE_CAT_PRO,
                    EXISTENCIA_ACTUAL_CAT_PRO
                )
                VALUES (
                    @idTienda,
                    @idProducto,
                    @precio,
                    @existencia
                );
            `);

        res.status(201).json({
            mensaje: 'Producto agregado al catalogo correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al agregar el producto al catalogo',
            error: error.message
        });
    }
};


const actualizarCatalogoProducto = async (req, res) => {
    try {
        const { idTienda, idProducto } = req.params;

        const {
            PRECIO_VIGENTE_CAT_PRO,
            EXISTENCIA_ACTUAL_CAT_PRO
        } = req.body;

        if (
            PRECIO_VIGENTE_CAT_PRO === undefined ||
            EXISTENCIA_ACTUAL_CAT_PRO === undefined
        ) {
            return res.status(400).json({
                mensaje: 'PRECIO_VIGENTE_CAT_PRO y EXISTENCIA_ACTUAL_CAT_PRO son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('idTienda', sql.Int, idTienda)
            .input('idProducto', sql.Int, idProducto)
            .input('precio', sql.Decimal(10, 2), PRECIO_VIGENTE_CAT_PRO)
            .input('existencia', sql.Int, EXISTENCIA_ACTUAL_CAT_PRO)
            .query(`
                UPDATE dbo.CATALOGO_PRODUCTO
                SET
                    PRECIO_VIGENTE_CAT_PRO = @precio,
                    EXISTENCIA_ACTUAL_CAT_PRO = @existencia
                WHERE ID_TI = @idTienda
                  AND ID_PRO = @idProducto;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Producto de catalogo no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto de catalogo actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el producto de catalogo',
            error: error.message
        });
    }
};


const eliminarCatalogoProducto = async (req, res) => {
    try {
        const { idTienda, idProducto } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('idTienda', sql.Int, idTienda)
            .input('idProducto', sql.Int, idProducto)
            .query(`
                DELETE FROM dbo.CATALOGO_PRODUCTO
                WHERE ID_TI = @idTienda
                  AND ID_PRO = @idProducto;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Producto de catalogo no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto eliminado del catalogo correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el producto del catalogo',
            error: error.message
        });
    }
};


module.exports = {
    obtenerCatalogoProductos,
    obtenerCatalogoProductoPorId,
    crearCatalogoProducto,
    actualizarCatalogoProducto,
    eliminarCatalogoProducto
};