const { sql, poolPromise } = require('../config/database');

const obtenerCategorias = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_CAT,
                NOMBRE_CAT
            FROM dbo.CATEGORIA
            ORDER BY ID_CAT;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las categorías',
            error: error.message
        });
    }
};


const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_CAT,
                    NOMBRE_CAT
                FROM dbo.CATEGORIA
                WHERE ID_CAT = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la categoría',
            error: error.message
        });
    }
};


const crearCategoria = async (req, res) => {
    try {
        const {
            ID_CAT,
            NOMBRE_CAT
        } = req.body;

        if (ID_CAT === undefined || !NOMBRE_CAT) {
            return res.status(400).json({
                mensaje: 'ID_CAT y NOMBRE_CAT son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_CAT)
            .input('nombre', sql.VarChar(50), NOMBRE_CAT)
            .query(`
                INSERT INTO dbo.CATEGORIA (
                    ID_CAT,
                    NOMBRE_CAT
                )
                VALUES (
                    @id,
                    @nombre
                );
            `);

        res.status(201).json({
            mensaje: 'Categoría creada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la categoría',
            error: error.message
        });
    }
};


const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE_CAT } = req.body;

        if (!NOMBRE_CAT) {
            return res.status(400).json({
                mensaje: 'NOMBRE_CAT es obligatorio'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(50), NOMBRE_CAT)
            .query(`
                UPDATE dbo.CATEGORIA
                SET NOMBRE_CAT = @nombre
                WHERE ID_CAT = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.json({
            mensaje: 'Categoría actualizada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la categoría',
            error: error.message
        });
    }
};


const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.CATEGORIA
                WHERE ID_CAT = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.json({
            mensaje: 'Categoría eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la categoría',
            error: error.message
        });
    }
};


module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};