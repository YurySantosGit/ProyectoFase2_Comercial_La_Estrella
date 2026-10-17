const { sql, poolPromise } = require('../config/database');

const obtenerTiposTienda = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT ID_TIP_TIE, NOMBRE_TIP_TIE
            FROM dbo.TIPO_TIENDA
            ORDER BY ID_TIP_TIE;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los tipos de tienda',
            error: error.message
        });
    }
};

const obtenerTipoTiendaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT ID_TIP_TIE, NOMBRE_TIP_TIE
                FROM dbo.TIPO_TIENDA
                WHERE ID_TIP_TIE = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Tipo de tienda no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el tipo de tienda',
            error: error.message
        });
    }
};

const crearTipoTienda = async (req, res) => {
    try {
        const { ID_TIP_TIE, NOMBRE_TIP_TIE } = req.body;

        if (ID_TIP_TIE === undefined || !NOMBRE_TIP_TIE) {
            return res.status(400).json({
                mensaje: 'ID_TIP_TIE y NOMBRE_TIP_TIE son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_TIP_TIE)
            .input('nombre', sql.VarChar(50), NOMBRE_TIP_TIE)
            .query(`
                INSERT INTO dbo.TIPO_TIENDA (
                    ID_TIP_TIE,
                    NOMBRE_TIP_TIE
                )
                VALUES (
                    @id,
                    @nombre
                );
            `);

        res.status(201).json({
            mensaje: 'Tipo de tienda creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el tipo de tienda',
            error: error.message
        });
    }
};

const actualizarTipoTienda = async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE_TIP_TIE } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(50), NOMBRE_TIP_TIE)
            .query(`
                UPDATE dbo.TIPO_TIENDA
                SET NOMBRE_TIP_TIE = @nombre
                WHERE ID_TIP_TIE = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Tipo de tienda no encontrado'
            });
        }

        res.json({
            mensaje: 'Tipo de tienda actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el tipo de tienda',
            error: error.message
        });
    }
};

const eliminarTipoTienda = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.TIPO_TIENDA
                WHERE ID_TIP_TIE = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Tipo de tienda no encontrado'
            });
        }

        res.json({
            mensaje: 'Tipo de tienda eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el tipo de tienda',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTiposTienda,
    obtenerTipoTiendaPorId,
    crearTipoTienda,
    actualizarTipoTienda,
    eliminarTipoTienda
};