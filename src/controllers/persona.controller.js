const { sql, poolPromise } = require('../config/database');

const obtenerPersonas = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_PER,
                NOMBRE_PER,
                APELLIDO_PER,
                TELEFONO,
                CORREO_PER,
                DIRECCION_PER,
                ID_MUN
            FROM dbo.PERSONA
            ORDER BY ID_PER;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las personas',
            error: error.message
        });
    }
};


const obtenerPersonaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_PER,
                    NOMBRE_PER,
                    APELLIDO_PER,
                    TELEFONO,
                    CORREO_PER,
                    DIRECCION_PER,
                    ID_MUN
                FROM dbo.PERSONA
                WHERE ID_PER = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Persona no encontrada'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la persona',
            error: error.message
        });
    }
};


const crearPersona = async (req, res) => {
    try {
        const {
            ID_PER,
            NOMBRE_PER,
            APELLIDO_PER,
            TELEFONO,
            CORREO_PER,
            DIRECCION_PER,
            ID_MUN
        } = req.body;

        if (
            ID_PER === undefined ||
            !NOMBRE_PER ||
            !APELLIDO_PER ||
            !TELEFONO ||
            !DIRECCION_PER ||
            ID_MUN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'ID_PER, NOMBRE_PER, APELLIDO_PER, TELEFONO, DIRECCION_PER e ID_MUN son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_PER)
            .input('nombre', sql.VarChar(50), NOMBRE_PER)
            .input('apellido', sql.VarChar(50), APELLIDO_PER)
            .input('telefono', sql.VarChar(20), TELEFONO)
            .input('correo', sql.VarChar(100), CORREO_PER ?? null)
            .input('direccion', sql.VarChar(150), DIRECCION_PER)
            .input('idMunicipio', sql.Int, ID_MUN)
            .query(`
                INSERT INTO dbo.PERSONA (
                    ID_PER,
                    NOMBRE_PER,
                    APELLIDO_PER,
                    TELEFONO,
                    CORREO_PER,
                    DIRECCION_PER,
                    ID_MUN
                )
                VALUES (
                    @id,
                    @nombre,
                    @apellido,
                    @telefono,
                    @correo,
                    @direccion,
                    @idMunicipio
                );
            `);

        res.status(201).json({
            mensaje: 'Persona creada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la persona',
            error: error.message
        });
    }
};


const actualizarPersona = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            NOMBRE_PER,
            APELLIDO_PER,
            TELEFONO,
            CORREO_PER,
            DIRECCION_PER,
            ID_MUN
        } = req.body;

        if (
            !NOMBRE_PER ||
            !APELLIDO_PER ||
            !TELEFONO ||
            !DIRECCION_PER ||
            ID_MUN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'NOMBRE_PER, APELLIDO_PER, TELEFONO, DIRECCION_PER e ID_MUN son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(50), NOMBRE_PER)
            .input('apellido', sql.VarChar(50), APELLIDO_PER)
            .input('telefono', sql.VarChar(20), TELEFONO)
            .input('correo', sql.VarChar(100), CORREO_PER ?? null)
            .input('direccion', sql.VarChar(150), DIRECCION_PER)
            .input('idMunicipio', sql.Int, ID_MUN)
            .query(`
                UPDATE dbo.PERSONA
                SET
                    NOMBRE_PER = @nombre,
                    APELLIDO_PER = @apellido,
                    TELEFONO = @telefono,
                    CORREO_PER = @correo,
                    DIRECCION_PER = @direccion,
                    ID_MUN = @idMunicipio
                WHERE ID_PER = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Persona no encontrada'
            });
        }

        res.json({
            mensaje: 'Persona actualizada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la persona',
            error: error.message
        });
    }
};


const eliminarPersona = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.PERSONA
                WHERE ID_PER = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Persona no encontrada'
            });
        }

        res.json({
            mensaje: 'Persona eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la persona',
            error: error.message
        });
    }
};


module.exports = {
    obtenerPersonas,
    obtenerPersonaPorId,
    crearPersona,
    actualizarPersona,
    eliminarPersona
};