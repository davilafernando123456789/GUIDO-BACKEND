const express = require('express');
const reportController = require('../controllers/reporteController');
const router = express.Router();

router.post('/', reportController.createReport);
router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.put('/reportes/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);

module.exports = router;
