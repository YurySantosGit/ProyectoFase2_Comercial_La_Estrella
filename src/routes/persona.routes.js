const express = require('express');

const router = express.Router();

const {
    obtenerPersonas,
    obtenerPersonaPorId,
    crearPersona,
    actualizarPersona,
    eliminarPersona
} = require('../controllers/persona.controller');

router.get('/', obtenerPersonas);
router.get('/:id', obtenerPersonaPorId);
router.post('/', crearPersona);
router.put('/:id', actualizarPersona);
router.delete('/:id', eliminarPersona);

module.exports = router;