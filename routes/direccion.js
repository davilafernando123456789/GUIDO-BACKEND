// routes/horarioRoutes.js
const express = require('express');
const router = express.Router();
const direccionController = require('../controllers/direccionController');

// Rutas para los horarios
router.get('/', direccionController.getAllDirecciones);
router.post('/', direccionController.createDireccion);

module.exports = router;
