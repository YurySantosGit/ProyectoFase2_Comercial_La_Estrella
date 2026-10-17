const { sql, poolPromise } = require('../config/database');

const obtenerMetodosPago = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_MET_PAG,
                NOMBRE_MET_PAG
            FROM dbo.METODO_PAGO
            ORDER BY ID_MET_PAG;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los metodos de pago',
            error: error.message
        });
    }
};


const obtenerMetodoPagoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_MET_PAG,
                    NOMBRE_MET_PAG
                FROM dbo.METODO_PAGO
                WHERE ID_MET_PAG = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Metodo de pago no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el metodo de pago',
            error: error.message
        });
    }
};


const crearMetodoPago = async (req, res) => {
    try {
        const {
            ID_MET_PAG,
            NOMBRE_MET_PAG
        } = req.body;

        if (ID_MET_PAG === undefined || !NOMBRE_MET_PAG) {
            return res.status(400).json({
                mensaje: 'ID_MET_PAG y NOMBRE_MET_PAG son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_MET_PAG)
            .input('nombre', sql.VarChar(50), NOMBRE_MET_PAG)
            .query(`
                INSERT INTO dbo.METODO_PAGO (
                    ID_MET_PAG,
                    NOMBRE_MET_PAG
                )
                VALUES (
                    @id,
                    @nombre
                );
            `);

        res.status(201).json({
            mensaje: 'Metodo de pago creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el metodo de pago',
            error: error.message
        });
    }
};


const actualizarMetodoPago = async (req, res) => {
    try {
        const { id } = req.params;
        const { NOMBRE_MET_PAG } = req.body;

        if (!NOMBRE_MET_PAG) {
            return res.status(400).json({
                mensaje: 'NOMBRE_MET_PAG es obligatorio'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(50), NOMBRE_MET_PAG)
            .query(`
                UPDATE dbo.METODO_PAGO
                SET NOMBRE_MET_PAG = @nombre
                WHERE ID_MET_PAG = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Metodo de pago no encontrado'
            });
        }

        res.json({
            mensaje: 'Metodo de pago actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el metodo de pago',
            error: error.message
        });
    }
};


const eliminarMetodoPago = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.METODO_PAGO
                WHERE ID_MET_PAG = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Metodo de pago no encontrado'
            });
        }

        res.json({
            mensaje: 'Metodo de pago eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el metodo de pago',
            error: error.message
        });
    }
};


module.exports = {
    obtenerMetodosPago,
    obtenerMetodoPagoPorId,
    crearMetodoPago,
    actualizarMetodoPago,
    eliminarMetodoPago
};