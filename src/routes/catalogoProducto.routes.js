const express = require('express');

const router = express.Router();

const {
    obtenerCatalogoProductos,
    obtenerCatalogoProductoPorId,
    crearCatalogoProducto,
    actualizarCatalogoProducto,
    eliminarCatalogoProducto
} = require('../controllers/catalogoProducto.controller');

router.get('/', obtenerCatalogoProductos);
router.get('/:idTienda/:idProducto', obtenerCatalogoProductoPorId);
router.post('/', crearCatalogoProducto);
router.put('/:idTienda/:idProducto', actualizarCatalogoProducto);
router.delete('/:idTienda/:idProducto', eliminarCatalogoProducto);

module.exports = router;