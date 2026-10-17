const { sql, poolPromise } = require('../config/database');

const obtenerTiendas = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_TI,
                NOMBRE_TI,
                DIRECCION_TI,
                TELEFONO_TI,
                ID_TIP_TIE,
                ID_MUN
            FROM dbo.TIENDA
            ORDER BY ID_TI;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las tiendas',
            error: error.message
        });
    }
};


const obtenerTiendaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_TI,
                    NOMBRE_TI,
                    DIRECCION_TI,
                    TELEFONO_TI,
                    ID_TIP_TIE,
                    ID_MUN
                FROM dbo.TIENDA
                WHERE ID_TI = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Tienda no encontrada'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la tienda',
            error: error.message
        });
    }
};


const crearTienda = async (req, res) => {
    try {
        const {
            ID_TI,
            NOMBRE_TI,
            DIRECCION_TI,
            TELEFONO_TI,
            ID_TIP_TIE,
            ID_MUN
        } = req.body;

        if (
            ID_TI === undefined ||
            !NOMBRE_TI ||
            !DIRECCION_TI ||
            !TELEFONO_TI ||
            ID_TIP_TIE === undefined ||
            ID_MUN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_TI)
            .input('nombre', sql.VarChar(80), NOMBRE_TI)
            .input('direccion', sql.VarChar(150), DIRECCION_TI)
            .input('telefono', sql.VarChar(20), TELEFONO_TI)
            .input('idTipoTienda', sql.Int, ID_TIP_TIE)
            .input('idMunicipio', sql.Int, ID_MUN)
            .query(`
                INSERT INTO dbo.TIENDA (
                    ID_TI,
                    NOMBRE_TI,
                    DIRECCION_TI,
                    TELEFONO_TI,
                    ID_TIP_TIE,
                    ID_MUN
                )
                VALUES (
                    @id,
                    @nombre,
                    @direccion,
                    @telefono,
                    @idTipoTienda,
                    @idMunicipio
                );
            `);

        res.status(201).json({
            mensaje: 'Tienda creada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la tienda',
            error: error.message
        });
    }
};


const actualizarTienda = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            NOMBRE_TI,
            DIRECCION_TI,
            TELEFONO_TI,
            ID_TIP_TIE,
            ID_MUN
        } = req.body;

        if (
            !NOMBRE_TI ||
            !DIRECCION_TI ||
            !TELEFONO_TI ||
            ID_TIP_TIE === undefined ||
            ID_MUN === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(80), NOMBRE_TI)
            .input('direccion', sql.VarChar(150), DIRECCION_TI)
            .input('telefono', sql.VarChar(20), TELEFONO_TI)
            .input('idTipoTienda', sql.Int, ID_TIP_TIE)
            .input('idMunicipio', sql.Int, ID_MUN)
            .query(`
                UPDATE dbo.TIENDA
                SET
                    NOMBRE_TI = @nombre,
                    DIRECCION_TI = @direccion,
                    TELEFONO_TI = @telefono,
                    ID_TIP_TIE = @idTipoTienda,
                    ID_MUN = @idMunicipio
                WHERE ID_TI = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Tienda no encontrada'
            });
        }

        res.json({
            mensaje: 'Tienda actualizada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la tienda',
            error: error.message
        });
    }
};


const eliminarTienda = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.TIENDA
                WHERE ID_TI = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Tienda no encontrada'
            });
        }

        res.json({
            mensaje: 'Tienda eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la tienda',
            error: error.message
        });
    }
};


module.exports = {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    actualizarTienda,
    eliminarTienda
};