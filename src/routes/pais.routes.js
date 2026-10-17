const express = require('express');

const router = express.Router();

const {
    obtenerPaises,
    obtenerPaisPorId,
    crearPais,
    actualizarPais,
    eliminarPais
} = require('../controllers/pais.controller');


router.get('/', obtenerPaises);

router.get('/:id', obtenerPaisPorId);

router.post('/', crearPais);

router.put('/:id', actualizarPais);

router.delete('/:id', eliminarPais);


module.exports = router;