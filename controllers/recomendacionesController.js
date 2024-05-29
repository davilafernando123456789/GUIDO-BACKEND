// controllers/recomendacionesController.js
const Recomendaciones = require('../models/Recomendaciones');

exports.createRecomendacion = async (req, res) => {
  try {
    console.log('Iniciando creación de recomendación');
    const recomendacion = await Recomendaciones.create({
      estrellas: req.body.estrellas,
      comentario: req.body.comentario,
      Alumnos_id: req.body.Alumnos_id,
      Profesores_id: req.body.Profesores_id
    });
    console.log('Recomendación creada exitosamente:', recomendacion);
    res.status(201).json(recomendacion);
  } catch (error) {
    console.error('Error al crear la recomendación:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getRecomendaciones = async (req, res) => {
  try {
    console.log('Iniciando obtención de recomendaciones');
    const recomendaciones = await Recomendaciones.findAll();
    console.log('Recomendaciones obtenidas exitosamente:', recomendaciones);
    res.status(200).json(recomendaciones);
  } catch (error) {
    console.error('Error al obtener las recomendaciones:', error);
    res.status(400).json({ error: error.message });
  }
};

// controllers/recomendacionesController.js
// const db = require('../config/db');
// const { Recomendaciones } = require('../models/Recomendaciones'); 

// exports.createRecomendacion = async (req, res) => {
//   try {
//     console.log('Iniciando creación de recomendación');
//     const recomendacion = await db.Recomendaciones.create({
//       estrellas: req.body.estrellas,
//       comentario: req.body.comentario,
//       Alumnos_id: req.body.Alumnos_id,
//       Profesores_id: req.body.Profesores_id
//     });
//     console.log('Recomendación creada exitosamente:', recomendacion);
//     res.status(201).json(recomendacion);
//   } catch (error) {
//     console.error('Error al crear la recomendación:', error);
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.getRecomendaciones = async (req, res) => {
//   try {
//     console.log('Iniciando obtención de recomendaciones');
//     const recomendaciones = await db.Recomendaciones.findAll();
//     console.log('Recomendaciones obtenidas exitosamente:', recomendaciones);
//     res.status(200).json(recomendaciones);
//   } catch (error) {
//     console.error('Error al obtener las recomendaciones:', error);
//     res.status(400).json({ error: error.message });
//   }
// };
