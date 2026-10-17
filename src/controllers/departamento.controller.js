const { sql, poolPromise } = require('../config/database');

const obtenerDepartamentos = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_DEP,
                NOMBRE_DEP,
                ID_PA
            FROM dbo.DEPARTAMENTO
            ORDER BY ID_DEP;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los departamentos',
            error: error.message
        });
    }
};


const obtenerDepartamentoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_DEP,
                    NOMBRE_DEP,
                    ID_PA
                FROM dbo.DEPARTAMENTO
                WHERE ID_DEP = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Departamento no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el departamento',
            error: error.message
        });
    }
};


const crearDepartamento = async (req, res) => {
    try {
        const {
            ID_DEP,
            NOMBRE_DEP,
            ID_PA
        } = req.body;

        if (
            ID_DEP === undefined ||
            !NOMBRE_DEP ||
            ID_PA === undefined
        ) {
            return res.status(400).json({
                mensaje: 'ID_DEP, NOMBRE_DEP e ID_PA son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_DEP)
            .input('nombre', sql.VarChar(50), NOMBRE_DEP)
            .input('idPais', sql.Int, ID_PA)
            .query(`
                INSERT INTO dbo.DEPARTAMENTO (
                    ID_DEP,
                    NOMBRE_DEP,
                    ID_PA
                )
                VALUES (
                    @id,
                    @nombre,
                    @idPais
                );
            `);

        res.status(201).json({
            mensaje: 'Departamento creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el departamento',
            error: error.message
        });
    }
};


const actualizarDepartamento = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            NOMBRE_DEP,
            ID_PA
        } = req.body;

        if (!NOMBRE_DEP || ID_PA === undefined) {
            return res.status(400).json({
                mensaje: 'NOMBRE_DEP e ID_PA son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(50), NOMBRE_DEP)
            .input('idPais', sql.Int, ID_PA)
            .query(`
                UPDATE dbo.DEPARTAMENTO
                SET
                    NOMBRE_DEP = @nombre,
                    ID_PA = @idPais
                WHERE ID_DEP = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Departamento no encontrado'
            });
        }

        res.json({
            mensaje: 'Departamento actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el departamento',
            error: error.message
        });
    }
};


const eliminarDepartamento = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.DEPARTAMENTO
                WHERE ID_DEP = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Departamento no encontrado'
            });
        }

        res.json({
            mensaje: 'Departamento eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el departamento',
            error: error.message
        });
    }
};


module.exports = {
    obtenerDepartamentos,
    obtenerDepartamentoPorId,
    crearDepartamento,
    actualizarDepartamento,
    eliminarDepartamento
};