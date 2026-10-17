const { sql, poolPromise } = require('../config/database');

const obtenerEmpleados = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                ID_EMP,
                FECHA_CONTRATACION,
                ID_TI,
                ID_CAR,
                ID_PER
            FROM dbo.EMPLEADO
            ORDER BY ID_EMP;
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los empleados',
            error: error.message
        });
    }
};


const obtenerEmpleadoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    ID_EMP,
                    FECHA_CONTRATACION,
                    ID_TI,
                    ID_CAR,
                    ID_PER
                FROM dbo.EMPLEADO
                WHERE ID_EMP = @id;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Empleado no encontrado'
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el empleado',
            error: error.message
        });
    }
};


const crearEmpleado = async (req, res) => {
    try {
        const {
            ID_EMP,
            FECHA_CONTRATACION,
            ID_TI,
            ID_CAR,
            ID_PER
        } = req.body;

        if (
            ID_EMP === undefined ||
            !FECHA_CONTRATACION ||
            ID_TI === undefined ||
            ID_CAR === undefined ||
            ID_PER === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, ID_EMP)
            .input('fecha', sql.Date, FECHA_CONTRATACION)
            .input('idTienda', sql.Int, ID_TI)
            .input('idCargo', sql.Int, ID_CAR)
            .input('idPersona', sql.Int, ID_PER)
            .query(`
                INSERT INTO dbo.EMPLEADO (
                    ID_EMP,
                    FECHA_CONTRATACION,
                    ID_TI,
                    ID_CAR,
                    ID_PER
                )
                VALUES (
                    @id,
                    @fecha,
                    @idTienda,
                    @idCargo,
                    @idPersona
                );
            `);

        res.status(201).json({
            mensaje: 'Empleado creado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el empleado',
            error: error.message
        });
    }
};


const actualizarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            FECHA_CONTRATACION,
            ID_TI,
            ID_CAR,
            ID_PER
        } = req.body;

        if (
            !FECHA_CONTRATACION ||
            ID_TI === undefined ||
            ID_CAR === undefined ||
            ID_PER === undefined
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('fecha', sql.Date, FECHA_CONTRATACION)
            .input('idTienda', sql.Int, ID_TI)
            .input('idCargo', sql.Int, ID_CAR)
            .input('idPersona', sql.Int, ID_PER)
            .query(`
                UPDATE dbo.EMPLEADO
                SET
                    FECHA_CONTRATACION = @fecha,
                    ID_TI = @idTienda,
                    ID_CAR = @idCargo,
                    ID_PER = @idPersona
                WHERE ID_EMP = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Empleado no encontrado'
            });
        }

        res.json({
            mensaje: 'Empleado actualizado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el empleado',
            error: error.message
        });
    }
};


const eliminarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM dbo.EMPLEADO
                WHERE ID_EMP = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: 'Empleado no encontrado'
            });
        }

        res.json({
            mensaje: 'Empleado eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el empleado',
            error: error.message
        });
    }
};


module.exports = {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
};