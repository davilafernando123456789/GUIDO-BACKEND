const express = require('express');
const router = express.Router();

// Importar controladores
const administradorController = require('../controllers/administradorController');

// Rutas para Administradores
router.get('/', administradorController.getAllAdministradores);
router.get('/:id', administradorController.getAdministradorById);

module.exports = router;
