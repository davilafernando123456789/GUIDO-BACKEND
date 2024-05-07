// controllers/cursoController.js
const Curso = require('../models/Cursos'); // Asegúrate de tener el modelo Curso importado

// Obtener todos los cursos
exports.getAllCursos = async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    res.json(cursos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
};

// Crear un nuevo curso
exports.createCurso = async (req, res) => {
  try {
    const curso = await Curso.create(req.body);
    res.status(201).json(curso);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear curso' });
  }
};
