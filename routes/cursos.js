const express = require('express');
const router = express.Router();

// Importar controladores
const cursosController = require('../controllers/cursosController');

// Rutas para Alumnos
router.get('/', cursosController.getAllCursos);
router.post('/', cursosController.createCurso);

module.exports = router;