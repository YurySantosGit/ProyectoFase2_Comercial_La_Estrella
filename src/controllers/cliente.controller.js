const { sql, poolPromise } = require('../config/database');

const obtenerClientes = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_CLI,
                NUMERO_IDENTIFICACION,
                ID_TIP_IDE,
                ID_PER
            FROM dbo.CLIENTE
            ORDER BY ID_CLI;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los clientes',
            error: error.message
        });
    }
};


const obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_CLI,
                    NUMERO_IDENTIFICACION,
                    ID_TIP_IDE,
                    ID_PER
                FROM dbo.CLIENTE
                WHERE ID_CLI = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el cliente',
            error: error.message
        });
    }
};


const crearCliente = async (req, res) => {
    try {
        const {
            ID_CLI,
            NUMERO_IDENTIFICACION,
            ID_TIP_IDE,
            ID_PER
        } = req.body;

        if (
            ID_CLI === undefined ||
            !NUMERO_IDENTIFICACION ||
            ID_TIP_IDE === undefined ||
            ID_PER === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_CLI)
            .input('numeroIdentificacion', sql.VarChar(20), NUMERO_IDENTIFICACION)
            .input('idTipoIdentificacion', sql.Int, ID_TIP_IDE)
            .input('idPersona', sql.Int, ID_PER)
            .query(`
                INSERT INTO dbo.CLIENTE (
                    ID_CLI,
                    NUMERO_IDENTIFICACION,
                    ID_TIP_IDE,
                    ID_PER
                )
                VALUES (
                    @id,
                    @numeroIdentificacion,
                    @idTipoIdentificacion,
                    @idPersona
                );
            `);

        res.status(201).json({
            mensaje: 'Cliente creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el cliente',
            error: error.message
        });
    }
};


const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            NUMERO_IDENTIFICACION,
            ID_TIP_IDE,
            ID_PER
        } = req.body;

        if (
            !NUMERO_IDENTIFICACION ||
            ID_TIP_IDE === undefined ||
            ID_PER === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('numeroIdentificacion', sql.VarChar(20), NUMERO_IDENTIFICACION)
            .input('idTipoIdentificacion', sql.Int, ID_TIP_IDE)
            .input('idPersona', sql.Int, ID_PER)
            .query(`
                UPDATE dbo.CLIENTE
                SET
                    NUMERO_IDENTIFICACION = @numeroIdentificacion,
                    ID_TIP_IDE = @idTipoIdentificacion,
                    ID_PER = @idPersona
                WHERE ID_CLI = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.json({
            mensaje: 'Cliente actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el cliente',
            error: error.message
        });
    }
};


const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.CLIENTE
                WHERE ID_CLI = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.json({
            mensaje: 'Cliente eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el cliente',
            error: error.message
        });
    }
};


module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};