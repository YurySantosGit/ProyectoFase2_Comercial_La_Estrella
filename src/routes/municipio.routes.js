const express = require('express');

const router = express.Router();

const {
    obtenerMunicipios,
    obtenerMunicipioPorId,
    crearMunicipio,
    actualizarMunicipio,
    eliminarMunicipio
} = require('../controllers/municipio.controller');

router.get('/', obtenerMunicipios);
router.get('/:id', obtenerMunicipioPorId);
router.post('/', crearMunicipio);
router.put('/:id', actualizarMunicipio);
router.delete('/:id', eliminarMunicipio);

module.exports = router;