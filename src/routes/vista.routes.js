const express = require('express');
const router = express.Router();

const {
    obtenerVentasUbicacion,
    obtenerTopProductos,
    obtenerSaldosPendientes
} = require('../controllers/vista.controller');

router.get(
    '/ventas-ubicacion',
    obtenerVentasUbicacion
);

router.get(
    '/top-productos',
    obtenerTopProductos
);

router.get(
    '/saldos-pendientes',
    obtenerSaldosPendientes
);

module.exports = router;