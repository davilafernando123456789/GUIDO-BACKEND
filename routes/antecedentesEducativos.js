// routes/horarioRoutes.js
const express = require('express');
const router = express.Router();
const antecedentesEducativosController = require('../controllers/antecedentesEducativosController');

// Rutas para los horarios
router.get('/', antecedentesEducativosController.getAllAntecedentesEducativos);
router.post('/', antecedentesEducativosController.createAntecedenteEducativo);

module.exports = router;
