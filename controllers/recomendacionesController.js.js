// controllers/recomendacionesController.js

const db = require('../models');

exports.createRecomendacion = async (req, res) => {
  try {
    const recomendacion = await db.Recomendaciones.create({
      estrellas: req.body.estrellas,
      comentario: req.body.comentario,
      Alumnos_id: req.body.Alumnos_id,
      Profesores_id: req.body.Profesores_id
    });
    res.status(201).json(recomendacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRecomendaciones = async (req, res) => {
  try {
    const recomendaciones = await db.Recomendaciones.findAll();
    res.status(200).json(recomendaciones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
