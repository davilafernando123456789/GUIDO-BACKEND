// controllers/recomendacionesController.js
const Recomendaciones = require('../models/Recomendaciones');
const Alumno = require('../models/Alumno'); 

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
exports.getRecomendacionesByProfesorId = async (req, res) => {
  try {
    const profesorId = req.params.Profesores_id;
    console.log(`Iniciando obtención de recomendaciones para el profesor ID: ${profesorId}`);
    const recomendaciones = await Recomendaciones.findAll({
      where: { Profesores_id: profesorId },
      include: [{
        model: Alumno,
        attributes: ['nombre']  // Ajusta los atributos según tus necesidades
      }]
    });
    console.log(`Recomendaciones obtenidas exitosamente para el profesor ID: ${profesorId}`, recomendaciones);
    res.status(200).json(recomendaciones);
  } catch (error) {
    console.error(`Error al obtener las recomendaciones para el profesor ID: ${profesorId}`, error);
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
