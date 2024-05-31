const Inscripciones = require("../models/Inscripciones");
const ProfesorPayPalAccount = require("../models/ProfesorPayPalAccounts");
const Notificacion = require("../models/Notificacion"); // Importa el modelo de Notificacion
const Profesores = require("../models/Profesor");
const sequelize = require("../config/db");
const Alumnos = require("../models/Alumno");
const Horario = require("../models/Horario");

// Crear una nueva inscripción
exports.createInscripcion = async (req, res) => {
  const { Alumnos_id, Profesores_id, Horario_id } = req.body;

  try {
    console.log('Datos recibidos para crear inscripción:', { Alumnos_id, Profesores_id, Horario_id });

    // Verificar si ya existe una inscripción con el mismo Horario_id
    const inscripcionExistente = await Inscripciones.findOne({
      where: { Horario_id, Alumnos_id },
    });

    if (inscripcionExistente) {
      console.log('Inscripción existente encontrada:', inscripcionExistente);
      return res.status(400).json({ message: "Ya existe una inscripción para este horario" });
    }

    const profesorPayPalAccount = await ProfesorPayPalAccount.findOne({
      where: { profesor_id: Profesores_id }
    });

    if (!profesorPayPalAccount) {
      console.log('No se encontró una cuenta PayPal para el profesor con ID:', Profesores_id);
      return res.status(400).json({ message: "No se encontró una cuenta PayPal para este profesor" });
    }

    // Crear la nueva inscripción si no existe una duplicada
    const inscripcion = await Inscripciones.create(req.body);
    console.log('Inscripción creada exitosamente:', inscripcion);

    // Obtener datos adicionales para la notificación
    const profesor = await Profesores.findByPk(Profesores_id);
    const alumno = await Alumnos.findByPk(Alumnos_id);
    const horario = await Horario.findByPk(Horario_id);

    if (profesor && alumno && horario) {
      const descripcion = `El alumno ${alumno.nombre} se registró a tu clase el ${horario.dia_semana} a las ${horario.hora_inicio}`;
      const notificacion = await Notificacion.create({
        usuario_id: Profesores_id,
        rol_id: 2,
        tipo: 'clase_registrada',
        descripcion: descripcion
      });
      console.log('Notificación creada para el profesor:', notificacion);
    } else {
      console.log('Datos insuficientes para crear la notificación');
    }

    res.status(201).json(inscripcion);
  } catch (error) {
    console.error('Error al crear la inscripción:', error);
    res.status(500).json({ message: "Error al crear la inscripción" });
  }
};


// // Crear una nueva inscripción
// exports.createInscripcion = async (req, res) => {
//   const { Alumnos_id, Profesores_id, Horario_id } = req.body;

//   try {
//     console.log('Datos recibidos para crear inscripción:', { Alumnos_id, Profesores_id, Horario_id });

//     // Verificar si ya existe una inscripción con el mismo Horario_id
//     const inscripcionExistente = await Inscripciones.findOne({
//       where: { Horario_id, Alumnos_id },
//     });

//     if (inscripcionExistente) {
//       console.log('Inscripción existente encontrada:', inscripcionExistente);
//       return res
//         .status(400)
//         .json({ message: "Ya existe una inscripción para este horario" });
//     }

//     const profesorPayPalAccount = await ProfesorPayPalAccount.findOne({
//       where: { profesor_id: Profesores_id }
//     });

//     if (!profesorPayPalAccount) {
//       console.log('No se encontró una cuenta PayPal para el profesor con ID:', Profesores_id);
//       return res
//         .status(400)
//         .json({ message: "No se encontró una cuenta PayPal para este profesor" });
//     }

//     // Crear la nueva inscripción si no existe una duplicada
//     const inscripcion = await Inscripciones.create(req.body);
//     console.log('Inscripción creada exitosamente:', inscripcion);

//     // Crear una notificación para el profesor
//     const profesor = await Profesores.findByPk(Profesores_id);

//     if (profesor) {
//       const notificacion = await Notificacion.create({
//         usuario_id: Profesores_id,
//         rol_id: 2, // Asumiendo que el rol_id se encuentra en el objeto profesor
//         tipo: 'clase_registrada',
//         descripcion: 'Un alumno se registró a tu clase'
//       });
//       console.log('Notificación creada para el profesor:', notificacion);
//     } else {
//       console.log('No se encontró el profesor con ID:', Profesores_id);
//     }

//     res.status(201).json(inscripcion);
//   } catch (error) {
//     console.error('Error al crear la inscripción:', error);
//     res.status(500).json({ message: "Error al crear la inscripción" });
//   }
// };


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



// // Crear una nueva inscripción
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
//     const profesorPayPalAccount = await ProfesorPayPalAccount.findOne({
//       where: { profesor_id: Profesores_id }
//     });

//     if (!profesorPayPalAccount) {
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