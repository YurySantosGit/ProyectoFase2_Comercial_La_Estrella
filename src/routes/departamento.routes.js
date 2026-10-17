const express = require('express');

const router = express.Router();

const {
    obtenerDepartamentos,
    obtenerDepartamentoPorId,
    crearDepartamento,
    actualizarDepartamento,
    eliminarDepartamento
} = require('../controllers/departamento.controller');

router.get('/', obtenerDepartamentos);
router.get('/:id', obtenerDepartamentoPorId);
router.post('/', crearDepartamento);
router.put('/:id', actualizarDepartamento);
router.delete('/:id', eliminarDepartamento);

module.exports = router;