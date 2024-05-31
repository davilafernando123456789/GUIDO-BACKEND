const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificacionController');

router.post('/crear', notificacionesController.crearNotificacion);
router.get('/:usuario_id', notificacionesController.obtenerNotificaciones);
router.put('/marcar-como-leido/:id', notificacionesController.marcarComoLeido);

module.exports = router;
