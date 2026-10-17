const express = require('express');

const router = express.Router();

const {
    obtenerEstadosVenta,
    obtenerEstadoVentaPorId,
    crearEstadoVenta,
    actualizarEstadoVenta,
    eliminarEstadoVenta
} = require('../controllers/estadoVenta.controller');

router.get('/', obtenerEstadosVenta);
router.get('/:id', obtenerEstadoVentaPorId);
router.post('/', crearEstadoVenta);
router.put('/:id', actualizarEstadoVenta);
router.delete('/:id', eliminarEstadoVenta);

module.exports = router;