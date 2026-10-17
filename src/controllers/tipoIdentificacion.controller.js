const { sql, poolPromise } = require('../config/database');

const obtenerTiposIdentificacion = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_TIP_IDE,
                NOMBRE_TIP_IDE
            FROM dbo.TIPO_IDENTIFICACION
            ORDER BY ID_TIP_IDE;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los tipos de identificación',
            error: error.message
        });
    }
};


const obtenerTipoIdentificacionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_TIP_IDE,
                    NOMBRE_TIP_IDE
                FROM dbo.TIPO_IDENTIFICACION
                WHERE ID_TIP_IDE = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Tipo de identificación no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el tipo de identificación',
            error: error.message
        });
    }
};


const crearTipoIdentificacion = async (req, res) => {
    try {
        const {
            ID_TIP_IDE,
            NOMBRE_TIP_IDE
        } = req.body;

        if (ID_TIP_IDE === undefined || !NOMBRE_TIP_IDE) {
            return res.status(400).json({
                mensaje: 'ID_TIP_IDE y NOMBRE_TIP_IDE son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_TIP_IDE)
            .input('nombre', sql.VarChar(30), NOMBRE_TIP_IDE)
            .query(`
                INSERT INTO dbo.TIPO_IDENTIFICACION (
                    ID_TIP_IDE,
                    NOMBRE_TIP_IDE
                )
                VALUES (
                    @id,
                    @nombre
                );
            `);

        res.status(201).json({
            mensaje: 'Tipo de identificación creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el tipo de identificación',
            error: error.message
        });
    }
};


const actualizarTipoIdentificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE_TIP_IDE } = req.body;

        if (!NOMBRE_TIP_IDE) {
            return res.status(400).json({
                mensaje: 'NOMBRE_TIP_IDE es obligatorio'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(30), NOMBRE_TIP_IDE)
            .query(`
                UPDATE dbo.TIPO_IDENTIFICACION
                SET NOMBRE_TIP_IDE = @nombre
                WHERE ID_TIP_IDE = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Tipo de identificación no encontrado'
            });
        }

        res.json({
            mensaje: 'Tipo de identificación actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el tipo de identificación',
            error: error.message
        });
    }
};


const eliminarTipoIdentificacion = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.TIPO_IDENTIFICACION
                WHERE ID_TIP_IDE = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Tipo de identificación no encontrado'
            });
        }

        res.json({
            mensaje: 'Tipo de identificación eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el tipo de identificación',
            error: error.message
        });
    }
};


module.exports = {
    obtenerTiposIdentificacion,
    obtenerTipoIdentificacionPorId,
    crearTipoIdentificacion,
    actualizarTipoIdentificacion,
    eliminarTipoIdentificacion
};