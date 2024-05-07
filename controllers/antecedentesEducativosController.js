// controllers/horarioController.js
const Educativos = require('../models/AntecedentesEducativo');// Asegúrate de tener el modelo Profesor importado

// Obtener todas las direcciones
exports.getAllAntecedentesEducativos = async (req, res) => {
    try {
      const educativos = await Educativos.findAll();
      res.json(educativos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener antecedentes educativos' });
    }
  };
  
  // Crear un nuevo profesor
  exports.createAntecedenteEducativo = async (req, res) => {
    try {
      const educativos = await Educativos.create(req.body);
      res.status(201).json(educativos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear antecedentes educativos' });
    }
  };