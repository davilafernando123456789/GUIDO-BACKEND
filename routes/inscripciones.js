const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');

// Rutas para Inscripciones
router.get('/', inscripcionController.getAllInscripciones);
router.get('/:id', inscripcionController.getInscripcionById);
router.post('/', inscripcionController.createInscripcion);
router.put('/editar/:id', inscripcionController.updateInscripcion);
router.delete('/:id', inscripcionController.deleteInscripcion);
router.get('/alumno/:alumnoId', inscripcionController.getInscripcionesByAlumnoId);
router.get('/profesor/:profesorId', inscripcionController.getInscripcionesByProfesorId);


module.exports = router;
