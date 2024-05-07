// controllers/horarioController.js
const Direccion = require('../models/Direccion');// Asegúrate de tener el modelo Profesor importado

// Obtener todas las direcciones
exports.getAllDirecciones = async (req, res) => {
    try {
      const direcciones = await Direccion.findAll();
      res.json(direcciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener direcciones' });
    }
  };
  
  // Crear un nuevo profesor
  exports.createDireccion = async (req, res) => {
    try {
      const nuevaDireccion = await Direccion.create(req.body);
      res.status(201).json(nuevaDireccion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear direccion' });
    }
  };