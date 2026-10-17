const express = require('express');

const router = express.Router();

const {
    obtenerMarcas,
    obtenerMarcaPorId,
    crearMarca,
    actualizarMarca,
    eliminarMarca
} = require('../controllers/marca.controller');

router.get('/', obtenerMarcas);
router.get('/:id', obtenerMarcaPorId);
router.post('/', crearMarca);
router.put('/:id', actualizarMarca);
router.delete('/:id', eliminarMarca);

module.exports = router;