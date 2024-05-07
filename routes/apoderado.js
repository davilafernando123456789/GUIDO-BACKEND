// routes/index.js
const express = require('express');
const router = express.Router();

// Importar controladores
const apoderadoController = require('../controllers/apoderadoController');

// Rutas para Apoderados
router.get('/', apoderadoController.getAllApoderados);
router.get('/:id', apoderadoController.getApoderadoById);
router.post('/', apoderadoController.createApoderado);
router.put('/:id', apoderadoController.updateApoderadoById);
router.delete('/:id', apoderadoController.deleteApoderadoById);

module.exports = router;