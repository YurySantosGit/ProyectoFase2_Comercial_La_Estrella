const { sql, poolPromise } = require('../config/database');

const obtenerProductos = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_PRO,
                NOMBRE_PRO,
                DESCRIPCION_PRO,
                ID_CAT,
                ID_MAR
            FROM dbo.PRODUCTO
            ORDER BY ID_PRO;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los productos',
            error: error.message
        });
    }
};


const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_PRO,
                    NOMBRE_PRO,
                    DESCRIPCION_PRO,
                    ID_CAT,
                    ID_MAR
                FROM dbo.PRODUCTO
                WHERE ID_PRO = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el producto',
            error: error.message
        });
    }
};


const crearProducto = async (req, res) => {
    try {
        const {
            ID_PRO,
            NOMBRE_PRO,
            DESCRIPCION_PRO,
            ID_CAT,
            ID_MAR
        } = req.body;

        if (
            ID_PRO === undefined ||
            !NOMBRE_PRO ||
            !DESCRIPCION_PRO ||
            ID_CAT === undefined ||
            ID_MAR === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_PRO)
            .input('nombre', sql.VarChar(100), NOMBRE_PRO)
            .input('descripcion', sql.VarChar(200), DESCRIPCION_PRO)
            .input('idCategoria', sql.Int, ID_CAT)
            .input('idMarca', sql.Int, ID_MAR)
            .query(`
                INSERT INTO dbo.PRODUCTO (
                    ID_PRO,
                    NOMBRE_PRO,
                    DESCRIPCION_PRO,
                    ID_CAT,
                    ID_MAR
                )
                VALUES (
                    @id,
                    @nombre,
                    @descripcion,
                    @idCategoria,
                    @idMarca
                );
            `);

        res.status(201).json({
            mensaje: 'Producto creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el producto',
            error: error.message
        });
    }
};


const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            NOMBRE_PRO,
            DESCRIPCION_PRO,
            ID_CAT,
            ID_MAR
        } = req.body;

        if (
            !NOMBRE_PRO ||
            !DESCRIPCION_PRO ||
            ID_CAT === undefined ||
            ID_MAR === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(100), NOMBRE_PRO)
            .input('descripcion', sql.VarChar(200), DESCRIPCION_PRO)
            .input('idCategoria', sql.Int, ID_CAT)
            .input('idMarca', sql.Int, ID_MAR)
            .query(`
                UPDATE dbo.PRODUCTO
                SET
                    NOMBRE_PRO = @nombre,
                    DESCRIPCION_PRO = @descripcion,
                    ID_CAT = @idCategoria,
                    ID_MAR = @idMarca
                WHERE ID_PRO = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el producto',
            error: error.message
        });
    }
};


const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.PRODUCTO
                WHERE ID_PRO = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el producto',
            error: error.message
        });
    }
};


module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};