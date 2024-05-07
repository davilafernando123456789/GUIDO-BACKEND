const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuariosController');

// Ruta para autenticar usuario
router.post('/auth', UsuariosController.autenticarUsuario);

module.exports = router;
