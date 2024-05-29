const Inscripciones = require("../models/Inscripciones");
const ProfesorPayPalAccount = require("../models/ProfesorPayPalAccounts");
const Suscripcion = require("../models/Suscripcion");
const Profesores = require("../models/Profesor");
const Alumno = require("../models/Alumno");
const sequelize = require("../config/db");


exports.obtenerProfesoresPorAlumnoId = async (req, res) => {
  try {
    const { alumnoId } = req.params;

    const inscripciones = await Inscripciones.findAll({
      where: {
        Alumnos_id: alumnoId
      },
      include: [
        {
          model: Profesores,
          as: 'Profesor', // Especificar el alias de la asociación
          attributes: ['id', 'nombre', 'apellido', 'especialidad']
        }
      ]
    });

    const profesores = inscripciones.map(inscripcion => inscripcion.Profesor);

    res.status(200).json(profesores);
  } catch (error) {
    console.error('Error al obtener profesores por alumno ID:', error);
    res.status(400).json({ error: error.message });
  }
};

// Crear una nueva inscripción
exports.createInscripcion = async (req, res) => {
  const { Alumnos_id, Profesores_id, Horario_id } = req.body;

  try {
    // Verificar si ya existe una inscripción con el mismo Horario_id
    const inscripcionExistente = await Inscripciones.findOne({
      where: { Horario_id, Alumnos_id },
    });

    if (inscripcionExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe una inscripción para este horario" });
    }
    const profesorPayPalAccount = await ProfesorPayPalAccount.findOne({
      where: { profesor_id: Profesores_id }
    });

    if (!profesorPayPalAccount) {
      return res
        .status(400)
        .json({ message: "Ya existe una inscripción para este horario" });
    }
    // Crear la nueva inscripción si no existe una duplicada
    const inscripcion = await Inscripciones.create(req.body);
    res.status(201).json(inscripcion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la inscripción" });
  }
};

// Obtener todas las inscripciones
exports.getAllInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripciones.findAll();
    res.json(inscripciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las inscripciones" });
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
      res.status(404).json({ message: "Inscripción no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la inscripción" });
  }
};


// Actualizar una inscripción
exports.updateInscripcion = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Inscripciones.update(req.body, {
      where: { id: id },
    });
    if (updated) {
      const updatedInscripcion = await Inscripciones.findByPk(id);
      res.json({
        message: "Inscripción actualizada",
        inscripcion: updatedInscripcion,
      });
    } else {
      res.status(404).json({ message: "Inscripción no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la inscripción" });
  }
};

// Eliminar una inscripción
exports.deleteInscripcion = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Inscripciones.destroy({
      where: { id: id },
    });
    if (deleted) {
      res.json({ message: "Inscripción eliminada" });
    } else {
      res.status(404).json({ message: "Inscripción no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la inscripción" });
  }
};
// Filtrar inscripciones por ID de alumno
exports.getInscripcionesByAlumnoId = async (req, res) => {
  const { alumnoId } = req.params;
  try {
    const inscripciones = await Inscripciones.findAll({
      where: { Alumnos_id: alumnoId },
    });
    res.json(inscripciones);
    console.log(inscripciones);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener las inscripciones del alumno" });
  }
};

// Filtrar inscripciones por ID de profesor
exports.getInscripcionesByProfesorId = async (req, res) => {
  const { profesorId } = req.params;
  try {
    const inscripciones = await Inscripciones.findAll({
      where: { Profesores_id: profesorId },
    });
    res.json(inscripciones);
    console.log(inscripciones);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener las inscripciones del profesor" });
  }
};

// // Crear una nueva inscripción
// exports.createInscripcion = async (req, res) => {
//   try {
//     const inscripcion = await Inscripciones.create(req.body);
//     res.status(201).json(inscripcion);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al crear la inscripción' });
//   }
// };

// Crear una nueva inscripción
// exports.createInscripcion = async (req, res) => {
//   const { Alumnos_id, Profesores_id, Horario_id } = req.body;

//   try {
//     // Verificar si ya existe una inscripción con el mismo Horario_id
//     const inscripcionExistente = await Inscripciones.findOne({
//       where: { Horario_id, Alumnos_id },
//     });

//     if (inscripcionExistente) {
//       return res
//         .status(400)
//         .json({ message: "Ya existe una inscripción para este horario" });
//     }

//     // Crear la nueva inscripción si no existe una duplicada
//     const inscripcion = await Inscripciones.create(req.body);
//     res.status(201).json(inscripcion);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al crear la inscripción" });
//   }
// };