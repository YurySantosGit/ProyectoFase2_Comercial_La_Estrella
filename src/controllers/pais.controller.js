const { sql, poolPromise } = require('../config/database');


// ========================================================
// GET - Obtener todos los países
// ========================================================
const obtenerPaises = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_PA,
                NOMBRE_PA
            FROM dbo.PAIS
            ORDER BY ID_PA;
        `);

        res.json(result.recordset);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los países',
            error: error.message
        });
    }
};


// ========================================================
// GET - Obtener país por ID
// ========================================================
const obtenerPaisPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_PA,
                    NOMBRE_PA
                FROM dbo.PAIS
                WHERE ID_PA = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'País no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el país',
            error: error.message
        });
    }
};


// ========================================================
// POST - Crear país
// ========================================================
const crearPais = async (req, res) => {
    try {
        const {
            ID_PA,
            NOMBRE_PA
        } = req.body;

        if (ID_PA === undefined || !NOMBRE_PA) {
            return res.status(400).json({
                mensaje: 'ID_PA y NOMBRE_PA son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_PA)
            .input('nombre', sql.VarChar(50), NOMBRE_PA)
            .query(`
                INSERT INTO dbo.PAIS (
                    ID_PA,
                    NOMBRE_PA
                )
                VALUES (
                    @id,
                    @nombre
                );
            `);

        res.status(201).json({
            mensaje: 'País creado correctamente',
            pais: {
                ID_PA,
                NOMBRE_PA
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el país',
            error: error.message
        });
    }
};


// ========================================================
// PUT - Actualizar país
// ========================================================
const actualizarPais = async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE_PA } = req.body;

        if (!NOMBRE_PA) {
            return res.status(400).json({
                mensaje: 'NOMBRE_PA es obligatorio'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(50), NOMBRE_PA)
            .query(`
                UPDATE dbo.PAIS
                SET NOMBRE_PA = @nombre
                WHERE ID_PA = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'País no encontrado'
            });
        }

        res.json({
            mensaje: 'País actualizado correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el país',
            error: error.message
        });
    }
};


// ========================================================
// DELETE - Eliminar país
// ========================================================
const eliminarPais = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.PAIS
                WHERE ID_PA = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'País no encontrado'
            });
        }

        res.json({
            mensaje: 'País eliminado correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el país',
            error: error.message
        });
    }
};


module.exports = {
    obtenerPaises,
    obtenerPaisPorId,
    crearPais,
    actualizarPais,
    eliminarPais
};