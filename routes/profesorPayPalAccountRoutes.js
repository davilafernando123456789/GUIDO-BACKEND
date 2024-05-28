const express = require('express');
const router = express.Router();
const profesorPayPalAccountController = require('../controllers/profesorPayPalAccountController');

router.post('/', profesorPayPalAccountController.createProfesorPayPalAccount);
router.get('/:id', profesorPayPalAccountController.getProfesorPayPalAccount);
router.put('/:id', profesorPayPalAccountController.updateProfesorPayPalAccount);
router.get('/profesor/:profesorId', profesorPayPalAccountController.getProfesorPayPalAccountByProfesorId);
router.delete('/:id', profesorPayPalAccountController.deleteProfesorPayPalAccount);

module.exports = router;
