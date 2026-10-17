const express = require('express');

const router = express.Router();

const {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    actualizarTienda,
    eliminarTienda
} = require('../controllers/tienda.controller');

router.get('/', obtenerTiendas);
router.get('/:id', obtenerTiendaPorId);
router.post('/', crearTienda);
router.put('/:id', actualizarTienda);
router.delete('/:id', eliminarTienda);

module.exports = router;