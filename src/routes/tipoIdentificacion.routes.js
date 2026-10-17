const express = require('express');

const router = express.Router();

const {
    obtenerTiposIdentificacion,
    obtenerTipoIdentificacionPorId,
    crearTipoIdentificacion,
    actualizarTipoIdentificacion,
    eliminarTipoIdentificacion
} = require('../controllers/tipoIdentificacion.controller');

router.get('/', obtenerTiposIdentificacion);
router.get('/:id', obtenerTipoIdentificacionPorId);
router.post('/', crearTipoIdentificacion);
router.put('/:id', actualizarTipoIdentificacion);
router.delete('/:id', eliminarTipoIdentificacion);

module.exports = router;