const express = require('express');

const router = express.Router();

const {
    obtenerDesglosesVenta,
    obtenerDesgloseVentaPorId,
    crearDesgloseVenta,
    actualizarDesgloseVenta,
    eliminarDesgloseVenta
} = require('../controllers/desgloseVenta.controller');

router.get('/', obtenerDesglosesVenta);
router.get('/:idVenta/:idProducto', obtenerDesgloseVentaPorId);
router.post('/', crearDesgloseVenta);
router.put('/:idVenta/:idProducto', actualizarDesgloseVenta);
router.delete('/:idVenta/:idProducto', eliminarDesgloseVenta);

module.exports = router;