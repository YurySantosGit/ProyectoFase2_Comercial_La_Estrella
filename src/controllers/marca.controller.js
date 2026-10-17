const { sql, poolPromise } = require('../config/database');

const obtenerMarcas = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_MAR,
                NOMBRE_MAR
            FROM dbo.MARCA
            ORDER BY ID_MAR;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las marcas',
            error: error.message
        });
    }
};


const obtenerMarcaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_MAR,
                    NOMBRE_MAR
                FROM dbo.MARCA
                WHERE ID_MAR = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Marca no encontrada'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la marca',
            error: error.message
        });
    }
};


const crearMarca = async (req, res) => {
    try {
        const {
            ID_MAR,
            NOMBRE_MAR
        } = req.body;

        if (ID_MAR === undefined || !NOMBRE_MAR) {
            return res.status(400).json({
                mensaje: 'ID_MAR y NOMBRE_MAR son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_MAR)
            .input('nombre', sql.VarChar(50), NOMBRE_MAR)
            .query(`
                INSERT INTO dbo.MARCA (
                    ID_MAR,
                    NOMBRE_MAR
                )
                VALUES (
                    @id,
                    @nombre
                );
            `);

        res.status(201).json({
            mensaje: 'Marca creada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la marca',
            error: error.message
        });
    }
};


const actualizarMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE_MAR } = req.body;

        if (!NOMBRE_MAR) {
            return res.status(400).json({
                mensaje: 'NOMBRE_MAR es obligatorio'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(50), NOMBRE_MAR)
            .query(`
                UPDATE dbo.MARCA
                SET NOMBRE_MAR = @nombre
                WHERE ID_MAR = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Marca no encontrada'
            });
        }

        res.json({
            mensaje: 'Marca actualizada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la marca',
            error: error.message
        });
    }
};


const eliminarMarca = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.MARCA
                WHERE ID_MAR = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Marca no encontrada'
            });
        }

        res.json({
            mensaje: 'Marca eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la marca',
            error: error.message
        });
    }
};


module.exports = {
    obtenerMarcas,
    obtenerMarcaPorId,
    crearMarca,
    actualizarMarca,
    eliminarMarca
};