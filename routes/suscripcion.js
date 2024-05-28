const express = require('express');
const router = express.Router();
const suscripcionController = require('../controllers/suscripcionController');

// Ruta para guardar suscripción
router.post('/', suscripcionController.guardarSuscripcion);
router.get('/:usuarioId/suscripcion-activa/:rol', suscripcionController.verificarSuscripcion);

module.exports = router;
