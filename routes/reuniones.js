const express = require('express');
const router = express.Router();
const reunionesController = require('../controllers/reunionesController');

// Obtener todas las reuniones
router.get('/', reunionesController.getReunionById);

// Crear una nueva reunión
router.post('/', reunionesController.createReunion);

module.exports = router;
