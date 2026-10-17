const express = require('express');

const router = express.Router();

const {
    obtenerMetodosPago,
    obtenerMetodoPagoPorId,
    crearMetodoPago,
    actualizarMetodoPago,
    eliminarMetodoPago
} = require('../controllers/metodoPago.controller');

router.get('/', obtenerMetodosPago);
router.get('/:id', obtenerMetodoPagoPorId);
router.post('/', crearMetodoPago);
router.put('/:id', actualizarMetodoPago);
router.delete('/:id', eliminarMetodoPago);

module.exports = router;