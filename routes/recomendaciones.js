// routes/recomendaciones.js

const express = require('express');
const router = express.Router();
const recomendacionesController = require('../controllers/recomendacionesController');

router.post('/', recomendacionesController.createRecomendacion);
router.get('/', recomendacionesController.getRecomendaciones);

module.exports = router;
