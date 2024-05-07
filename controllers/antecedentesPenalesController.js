// // controllers/horarioController.js
// const Penales = require('../models/AntecedentesPenal');// Asegúrate de tener el modelo Profesor importado

// // Obtener todas las direcciones
// exports.getAllAntecedentesPenales = async (req, res) => {
//     try {
//       const antecedentes = await Penales.findAll();
//       res.json(antecedentes);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error al obtener antecedentes penales' });
//     }
//   };
  
//   // Crear un nuevo profesor
//   exports.createAntecedentePenal = async (req, res) => {
//     try {
//       const antecedentes = await Penales.create(req.body);
//       res.status(201).json(antecedentes);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error al crear antecedentes penales' });
//     }
//   };