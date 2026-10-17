const express = require('express');

const router = express.Router();

const {
    obtenerTiposTienda,
    obtenerTipoTiendaPorId,
    crearTipoTienda,
    actualizarTipoTienda,
    eliminarTipoTienda
} = require('../controllers/tipoTienda.controller');

router.get('/', obtenerTiposTienda);
router.get('/:id', obtenerTipoTiendaPorId);
router.post('/', crearTipoTienda);
router.put('/:id', actualizarTipoTienda);
router.delete('/:id', eliminarTipoTienda);

module.exports = router;