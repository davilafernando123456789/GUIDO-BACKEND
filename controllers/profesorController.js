const Profesores = require("../models/Profesor");
const sequelize = require("../config/db");
const Direccion = require("../models/Direccion");
const Educativos = require("../models/AntecedentesEducativo");
const jwt = require("jsonwebtoken");

// const sequelize = require('../config/db');
const Sequelize = sequelize.Sequelize;
exports.createProfesor = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      email,
      usuario,
      password,
      nombre,
      apellido,
      dni,
      genero,
      telefono,
      fecha_nac,
      especialidad,
      descripcion,
      foto,
      Roles_id,
      direccion,
      educativos,
    } = req.body;

    // Crear la dirección
    const newDireccion = await Direccion.create(direccion, { transaction: t });

    // Crear el antecedente educativo
    const newAntecedenteEducativo = await Educativos.create(educativos, {
      transaction: t,
    });

    // Crear el profesor con el enlace de la sala de reuniones asociado
    const meetingRoomLink = "https://meet.jit.si/ProfesorClassroom" + nombre + apellido;

    // Crear el profesor con el enlace de la sala de reuniones asociado
    const newProfesor = await Profesores.create(
      {
        email,
        usuario,
        password,
        nombre,
        apellido,
        genero,
        dni,
        sala: meetingRoomLink,
        especialidad,
        descripcion,
        foto,
        telefono,
        fecha_nac,
        Roles_id,
        Direccion_id: newDireccion.id,
        Antecedentes_educativos_id: newAntecedenteEducativo.id,
      },
      { transaction: t }
    );

    // Crear token para profesores
    const token = jwt.sign({ id: newProfesor.id, rol: 2 }, "secreto", {
      expiresIn: "1h",
    });

    // Confirmar la transacción
    await t.commit();

    res.status(200).json({
      mensaje: "OK",
      rol: 2,
      usuario: {
        id: newProfesor.id,
        email: newProfesor.email,
        nombre: newProfesor.nombre,
        // Agrega otros campos del profesor que desees devolver
      },
      token,
    });
  } catch (error) {
    // Revertir la transacción en caso de error
    await t.rollback();
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Hubo un error al crear el profesor" });
  }
};

///Método para obtener un profesor por su ID
exports.getProfesorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el profesor por su ID en la base de datos
    const profesor = await Profesores.findByPk(id);

    if (!profesor) {
      return res.status(404).json({ message: "profesor no encontrado" });
    }

    // Enviar el profesor encontrado como respuesta
    res.json(profesor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al buscar el profesor" });
  }
};
exports.getAllProfesores = async (req, res) => {
  try {
    // Buscar todos los profesores en la base de datos con datos de antecedentes educativos
    const profesores = await Profesores.findAll({
      include: [
        {
          model: Educativos,
          as: "Educativos",
        },
      ],
    });

    res.json(profesores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al buscar los profesores" });
  }
};
exports.getAllProfesoresEspecialidad = async (req, res) => {
  try {
    const { especialidad } = req.query;
    let whereCondition = {};

    if (especialidad) {
      whereCondition = {
        especialidad: {
          [Sequelize.Op.like]: `%${especialidad}%`,
        },
      };
    }

    const profesores = await Profesores.findAll({
      where: whereCondition,
      include: [
        {
          model: Educativos,
          as: "Educativos",
        },
      ],
    });

    res.json(profesores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al buscar los profesores" });
  }
};
exports.getAllProfesoresNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    let whereCondition = {};

    if (nombre) {
      whereCondition = {
        nombre: {
          [Sequelize.Op.like]: `%${nombre}%`,
        },
      };
    }

    const profesores = await Profesores.findAll({
      where: whereCondition,
      include: [
        {
          model: Educativos,
          as: "Educativos",
        },
      ],
    });

    res.json(profesores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al buscar los profesores" });
  }
};

exports.updateProfesorById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      email,
      usuario,
      nombre,
      apellido,
      dni,
      genero,
      telefono,
      fecha_nac,
      especialidad,
      descripcion,
      foto,
      Roles_id,
    } = req.body;

    // Buscar el profesor por su ID en la base de datos
    const profesor = await Profesores.findByPk(id);

    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    // Actualizar los datos del profesor
    await profesor.update(
      {
        email,
        usuario,
        nombre,
        apellido,
        dni,
        genero,
        telefono,
        fecha_nac,
        especialidad,
        descripcion,
        foto,
        Roles_id,
      },
      { transaction: t }
    );

    // Commit la transacción
    await t.commit();
    res.json({ message: "Profesor actualizado correctamente" });
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res
      .status(500)
      .json({ message: "Hubo un error al actualizar el profesor" });
  }
};

exports.deleteProfesorById = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Buscar el profesor por su ID en la base de datos
    const profesor = await Profesores.findByPk(id);

    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    // Eliminar el profesor de la base de datos
    await profesor.destroy({ transaction: t });

    // Commit la transacción
    await t.commit();

    res.json({ message: "Profesor eliminado correctamente" });
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Hubo un error al eliminar el profesor" });
  }
};
// exports.createProfesor= async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { email, usuario, password, nombre, apellido, dni, genero, telefono, fecha_nac, especialidad, descripcion,  foto,  Roles_id, direccion, educativos } = req.body;

//     // Crear la dirección
//     const newDireccion = await Direccion.create(direccion, { transaction: t });

//     // Crear el apoderado
//     const newAntecedenteEducativo = await Educativos.create(educativos, { transaction: t });

//     // Crear el profesor
//     const newProfesor = await Profesores.create({
//       email,
//       usuario,
//       password,
//       nombre,
//       apellido,
//       genero,
//       dni,
//       especialidad,
//       descripcion,
//       foto,
//       telefono,
//       fecha_nac,
//       Roles_id,
//       Direccion_id: newDireccion.id,
//       Antecedentes_educativos_id: newAntecedenteEducativo.id
//     }, { transaction: t });

//     // Commit la transacción
//     await t.commit();

//     res.json(newProfesor);
//   } catch (error) {
//     // Rollback si hay un error
//     await t.rollback();
//     console.error(error);
//     res.status(500).json({ message: 'Hubo un error al crear el profesor' });
//   }
// };

// // Obtener un profesor por ID
// exports.getProfesorById = async (req, res) => {
//   const profesorId = req.params.id;

//   try {
//     const profesor = await Profesores.findByPk(profesorId);
//     if (profesor) {
//       res.json(profesor);
//     } else {
//       res.status(404).json({ error: 'Profesor no encontrado' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener profesor' });
//   }
// };

// // Actualizar un profesor por ID
// exports.updateProfesorById = async (req, res) => {
//   const profesorId = req.params.id;

//   try {
//     const [updatedRows] = await Profesores.update(req.body, {
//       where: { id: profesorId },
//     });

//     if (updatedRows > 0) {
//       res.json({ message: 'Profesor actualizado exitosamente' });
//     } else {
//       res.status(404).json({ error: 'Profesor no encontrado' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al actualizar profesor' });
//   }
// };

// // Eliminar un profesor por ID
// exports.deleteProfesorById = async (req, res) => {
//   const profesorId = req.params.id;

//   try {
//     const deletedRowCount = await Profesores.destroy({
//       where: { id: profesorId },
//     });

//     if (deletedRowCount > 0) {
//       res.json({ message: 'Profesor eliminado exitosamente' });
//     } else {
//       res.status(404).json({ error: 'Profesor no encontrado' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al eliminar profesor' });
//   }
// };

// const createMeetingRoom = require('../routes/meetings');
// const Profesores = require('../models/Profesor');
// const sequelize = require('../config/db');
// const Direccion = require('../models/Direccion');
// const Educativos = require('../models/AntecedentesEducativo');
// const MeetingRoom = require('../models/MeetingRoom');
// const meetingRoomController = require('../controllers/meetingRoomController');

// exports.createProfesor = async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     const { email, usuario, password, nombre, apellido, dni, genero, telefono, fecha_nac, especialidad, descripcion, foto, Roles_id, direccion, educativos } = req.body;

//     // Crear la dirección
//     const newDireccion = await Direccion.create(direccion, { transaction: t });

//     // Crear el antecedente educativo
//     const newAntecedenteEducativo = await Educativos.create(educativos, { transaction: t });

//     // Crear la sala de Google Meet
//     const meetingRoomData = await createMeetingRoom(`${nombre} ${apellido}`);

//     // Comprobar si hay datos válidos para la sala de reuniones
//     if (!meetingRoomData || !meetingRoomData.htmlLink) {
//       await t.rollback();
//       return res.status(400).json({ success: false, message: 'No se pudo crear la sala de reuniones' });
//     }

//     // Crear el profesor con el ID de la sala de reuniones asociada
//     const newProfesor = await Profesores.create({
//       email,
//       usuario,
//       password,
//       nombre,
//       apellido,
//       genero,
//       dni,
//       sala: meetingRoomData.htmlLink, // Guarda el enlace de la sala de reuniones
//       especialidad,
//       descripcion,
//       foto,
//       telefono,
//       fecha_nac,
//       Roles_id,
//       Direccion_id: newDireccion.id,
//       Antecedentes_educativos_id: newAntecedenteEducativo.id
//     }, { transaction: t });

//     // Crear la sala de reuniones y asociarla al profesor
//     await MeetingRoom.create({
//       idProfesor: newProfesor.id,
//       htmlLink: meetingRoomData.htmlLink,
//       startDateTime: meetingRoomData.start.dateTime,
//       endDateTime: meetingRoomData.end.dateTime,
//       iCalUID: meetingRoomData.iCalUID,
//       remindersUseDefault: meetingRoomData.reminders.useDefault,
//       creatorEmail: meetingRoomData.creator.email,
//       organizerEmail: meetingRoomData.organizer.email,
//     }, { transaction: t });

//     // Confirmar la transacción
//     await t.commit();
//     res.status(201).json({
//       success: true,
//       message: 'Profesor creado exitosamente',
//       professor: newProfesor.toJSON()
//     });
//   } catch (error) {
//     // Revertir la transacción en caso de error
//     await t.rollback();
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Hubo un error al crear el profesor' });
//   }
// };
