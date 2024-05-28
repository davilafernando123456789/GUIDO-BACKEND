// routes/index.js
const express = require('express');
const router = express.Router();

// Importar controladores
const alumnoController = require('../controllers/alumnoController');

// Rutas para Alumnos
router.get('/', alumnoController.getAllAlumnos);
router.get('/nombre/:nombre', alumnoController.getAlumnoByNombre); 
router.get('/:id', alumnoController.getAlumnoById);
router.post('/', alumnoController.createAlumno);
router.put('/editar/:id', alumnoController.updateAlumnoById);
router.delete('/:id', alumnoController.deleteAlumnoById);

module.exports = router;