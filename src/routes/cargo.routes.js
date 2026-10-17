const express = require('express');

const router = express.Router();

const {
    obtenerCargos,
    obtenerCargoPorId,
    crearCargo,
    actualizarCargo,
    eliminarCargo
} = require('../controllers/cargo.controller');

router.get('/', obtenerCargos);
router.get('/:id', obtenerCargoPorId);
router.post('/', crearCargo);
router.put('/:id', actualizarCargo);
router.delete('/:id', eliminarCargo);

module.exports = router;