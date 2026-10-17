const { sql, poolPromise } = require('../config/database');

const obtenerMunicipios = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_MUN,
                NOMBRE_MUN,
                ID_DEP
            FROM dbo.MUNICIPIO
            ORDER BY ID_MUN;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los municipios',
            error: error.message
        });
    }
};


const obtenerMunicipioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_MUN,
                    NOMBRE_MUN,
                    ID_DEP
                FROM dbo.MUNICIPIO
                WHERE ID_MUN = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Municipio no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el municipio',
            error: error.message
        });
    }
};


const crearMunicipio = async (req, res) => {
    try {
        const {
            ID_MUN,
            NOMBRE_MUN,
            ID_DEP
        } = req.body;

        if (
            ID_MUN === undefined ||
            !NOMBRE_MUN ||
            ID_DEP === undefined
        ) {
            return res.status(400).json({
                mensaje: 'ID_MUN, NOMBRE_MUN e ID_DEP son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_MUN)
            .input('nombre', sql.VarChar(60), NOMBRE_MUN)
            .input('idDepartamento', sql.Int, ID_DEP)
            .query(`
                INSERT INTO dbo.MUNICIPIO (
                    ID_MUN,
                    NOMBRE_MUN,
                    ID_DEP
                )
                VALUES (
                    @id,
                    @nombre,
                    @idDepartamento
                );
            `);

        res.status(201).json({
            mensaje: 'Municipio creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el municipio',
            error: error.message
        });
    }
};


const actualizarMunicipio = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            NOMBRE_MUN,
            ID_DEP
        } = req.body;

        if (!NOMBRE_MUN || ID_DEP === undefined) {
            return res.status(400).json({
                mensaje: 'NOMBRE_MUN e ID_DEP son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(60), NOMBRE_MUN)
            .input('idDepartamento', sql.Int, ID_DEP)
            .query(`
                UPDATE dbo.MUNICIPIO
                SET
                    NOMBRE_MUN = @nombre,
                    ID_DEP = @idDepartamento
                WHERE ID_MUN = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Municipio no encontrado'
            });
        }

        res.json({
            mensaje: 'Municipio actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el municipio',
            error: error.message
        });
    }
};


const eliminarMunicipio = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.MUNICIPIO
                WHERE ID_MUN = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Municipio no encontrado'
            });
        }

        res.json({
            mensaje: 'Municipio eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el municipio',
            error: error.message
        });
    }
};


module.exports = {
    obtenerMunicipios,
    obtenerMunicipioPorId,
    crearMunicipio,
    actualizarMunicipio,
    eliminarMunicipio
};