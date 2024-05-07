// routes/index.js
const express = require('express');
const router = express.Router();

// Importar controladores
const alumnoController = require('../controllers/alumnoController');

// Rutas para Alumnos
router.get('/', alumnoController.getAllAlumnos);
router.get('/:id', alumnoController.getAlumnoById);
router.post('/', alumnoController.createAlumno);
router.put('/:id', alumnoController.updateAlumnoById);
router.delete('/:id', alumnoController.deleteAlumnoById);
router.get('/nombre/:nombre', alumnoController.getAlumnoByNombre); 


module.exports = router;