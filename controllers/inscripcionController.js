const Inscripciones = require('../models/Inscripciones');

// Obtener todas las inscripciones
exports.getAllInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripciones.findAll();
    res.json(inscripciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las inscripciones' });
  }
};

// Obtener una inscripción por su ID
exports.getInscripcionById = async (req, res) => {
  const { id } = req.params;
  try {
    const inscripcion = await Inscripciones.findByPk(id);
    if (inscripcion) {
      res.json(inscripcion);
    } else {
      res.status(404).json({ message: 'Inscripción no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la inscripción' });
  }
};

// Crear una nueva inscripción
exports.createInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripciones.create(req.body);
    res.status(201).json(inscripcion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la inscripción' });
  }
};

// Actualizar una inscripción
exports.updateInscripcion = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Inscripciones.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedInscripcion = await Inscripciones.findByPk(id);
      res.json({ message: 'Inscripción actualizada', inscripcion: updatedInscripcion });
    } else {
      res.status(404).json({ message: 'Inscripción no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la inscripción' });
  }
};

// Eliminar una inscripción
exports.deleteInscripcion = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Inscripciones.destroy({
      where: { id: id }
    });
    if (deleted) {
      res.json({ message: 'Inscripción eliminada' });
    } else {
      res.status(404).json({ message: 'Inscripción no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la inscripción' });
  }
};
// Filtrar inscripciones por ID de alumno
exports.getInscripcionesByAlumnoId = async (req, res) => {
    const { alumnoId } = req.params;
    try {
      const inscripciones = await Inscripciones.findAll({
        where: { Alumnos_id: alumnoId }
      });
      res.json(inscripciones);
      console.log(inscripciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las inscripciones del alumno' });
    }
  };
  
  // Filtrar inscripciones por ID de profesor
  exports.getInscripcionesByProfesorId = async (req, res) => {
    const { profesorId } = req.params;
    try {
      const inscripciones = await Inscripciones.findAll({
        where: { Profesores_id: profesorId }
      });
      res.json(inscripciones);
      console.log(inscripciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las inscripciones del profesor' });
    }
  };
