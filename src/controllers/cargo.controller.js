const { sql, poolPromise } = require('../config/database');

const obtenerCargos = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_CAR,
                NOMBRE_CAR
            FROM dbo.CARGO
            ORDER BY ID_CAR;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los cargos',
            error: error.message
        });
    }
};


const obtenerCargoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_CAR,
                    NOMBRE_CAR
                FROM dbo.CARGO
                WHERE ID_CAR = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Cargo no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el cargo',
            error: error.message
        });
    }
};


const crearCargo = async (req, res) => {
    try {
        const {
            ID_CAR,
            NOMBRE_CAR
        } = req.body;

        if (ID_CAR === undefined || !NOMBRE_CAR) {
            return res.status(400).json({
                mensaje: 'ID_CAR y NOMBRE_CAR son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_CAR)
            .input('nombre', sql.VarChar(50), NOMBRE_CAR)
            .query(`
                INSERT INTO dbo.CARGO (
                    ID_CAR,
                    NOMBRE_CAR
                )
                VALUES (
                    @id,
                    @nombre
                );
            `);

        res.status(201).json({
            mensaje: 'Cargo creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el cargo',
            error: error.message
        });
    }
};


const actualizarCargo = async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE_CAR } = req.body;

        if (!NOMBRE_CAR) {
            return res.status(400).json({
                mensaje: 'NOMBRE_CAR es obligatorio'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(50), NOMBRE_CAR)
            .query(`
                UPDATE dbo.CARGO
                SET NOMBRE_CAR = @nombre
                WHERE ID_CAR = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Cargo no encontrado'
            });
        }

        res.json({
            mensaje: 'Cargo actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el cargo',
            error: error.message
        });
    }
};


const eliminarCargo = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.CARGO
                WHERE ID_CAR = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Cargo no encontrado'
            });
        }

        res.json({
            mensaje: 'Cargo eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el cargo',
            error: error.message
        });
    }
};


module.exports = {
    obtenerCargos,
    obtenerCargoPorId,
    crearCargo,
    actualizarCargo,
    eliminarCargo
};