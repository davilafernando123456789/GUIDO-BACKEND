const express = require('express');
const router = express.Router();
const profesorController = require('../controllers/profesorController');

// Rutas para Profesores
router.get('/', profesorController.getAllProfesores);
router.get('/filtrar/:id', profesorController.getProfesorById);
router.post('/', profesorController.createProfesor);
router.get('/buscar', profesorController.getAllProfesoresEspecialidad);
router.get('/search', profesorController.getAllProfesoresNombre);
router.put('/editar/:id', profesorController.updateProfesorById);
router.delete('/:id', profesorController.deleteProfesorById);
// Nueva ruta para confirmar el registro
// router.get('/confirmar-registro', profesorController.confirmarRegistro);

module.exports = router;