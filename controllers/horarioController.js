// controllers/horarioController.js
const  Alumno   = require("../models/Alumno");
const Horario = require("../models/Horario");
const Inscripcion = require("../models/Inscripciones");
const Profesor = require("../models/Profesor");
const sequelize = require('../config/db');
// Obtener todos los horarios
const getAllHorarios = async (req, res) => {
  try {
    const horarios = await Horario.findAll();
    res.json(horarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los horarios." });
  }
};

const createHorario = async (req, res) => {
  try {
    const { Profesores_id } = req.body;

    // Verificar si se proporcionó un Profesores_id válido
    if (!Profesores_id) {
      return res.status(400).json({ error: "Profesores_id es requerido" });
    }

    // Verificar si el Profesores_id existe
    const profesor = await Profesor.findByPk(Profesores_id);
    if (!profesor) {
      return res.status(404).json({ error: "El profesor no existe" });
    }

    // Crear nuevos horarios para cada conjunto de datos
    const nuevosHorarios = await Promise.all(
      req.body.horarios.map(async (data) => {
        const { titulo, dia_semana, hora_inicio, hora_fin, fecha, duracion } = data;
        const nuevoHorario = await Horario.create({
          titulo,
          dia_semana,
          hora_inicio,
          hora_fin,
          fecha,
          duracion,
          Profesores_id,
        });
        return nuevoHorario;
      })
    );

    res.status(201).json(nuevosHorarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear los horarios." });
  }
};

const getHorariosByProfesorId = async (req, res) => {
  const { idProfesor } = req.params;

  try {
    // Verificar si el profesor existe
    const profesor = await Profesor.findByPk(idProfesor);
    if (!profesor) {
      return res.status(404).json({ error: "Profesor no encontrado." });
    }

    // Obtener los horarios del profesor
    const horarios = await Horario.findAll({
      where: {
        Profesores_id: idProfesor,
      },
    });

    res.json(horarios);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los horarios del profesor." });
  }
};

// Obtener horario por su ID
const getHorarioById = async (req, res) => {
  const { horarioId } = req.params;

  try {
    // Buscar el horario por su ID
    const horario = await Horario.findByPk(horarioId);
    if (!horario) {
      return res.status(404).json({ error: "Horario no encontrado." });
    }

    res.json(horario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el horario." });
  }
};
const getHorariosByIds = async (req, res) => {
  const { ids } = req.query; // Accedemos a req.query en lugar de req.body

  try {
    // Convertimos los IDs de string a array
    const idArray = ids.split(',').map(id => parseInt(id.trim()));

    // Obtener los horarios por los IDs proporcionados
    const horarios = await Horario.findAll({
      where: {
        id: idArray // Filtrar por los IDs proporcionados
      }
    });

    res.json(horarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los horarios." });
  }
};
const getHorariosByAlumnoId = async (req, res) => {
  const { alumnoId } = req.params;

  try {
    // Verificar si el alumno existe
    const alumno = await Alumno.findByPk(alumnoId);
    if (!alumno) {
      console.log("Alumno no encontrado:", alumnoId);
      return res.status(404).json({ error: "Alumno no encontrado." });
    }

    console.log("Alumno encontrado:", alumno);

    // Obtener las inscripciones del alumno
    const inscripciones = await Inscripcion.findAll({
      where: {
        Alumnos_id: alumnoId,
      },
    });

    console.log("Inscripciones del alumno:", inscripciones);

    // Obtener los IDs de horarios asociados al alumno
    const horariosIds = inscripciones.map(inscripcion => inscripcion.Horario_id);

    console.log("IDs de horarios asociados:", horariosIds);

    // Obtener los horarios asociados a los IDs obtenidos
    const horarios = await Horario.findAll({
      where: {
        id: horariosIds,
      },
    });

    console.log("Horarios encontrados:", horarios);

    res.json(horarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los horarios del alumno." });
  }
};
const deleteHorarioById = async (req, res) => {
  const { horarioId } = req.params;

  try {
    // Buscar el horario por su ID
    const horario = await Horario.findByPk(horarioId);
    if (!horario) {
      return res.status(404).json({ error: "Horario no encontrado." });
    }

    // Eliminar el horario
    await Horario.destroy({
      where: {
        id: horarioId
      }
    });

    res.json({ message: "Horario eliminado correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el horario." });
  }
};

const getHorariosByFecha = async (req, res) => {
  try {
    let { fecha } = req.query;

    // Convertir la fecha a formato ISO sin la hora
    fecha = new Date(fecha).toISOString().split('T')[0];

    // Obtener los horarios por fecha
    const horarios = await Horario.findAll({
      where: sequelize.literal(`DATE(fecha) = '${fecha}'`)
    });

    res.json(horarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los horarios por fecha." });
  }
};

const updateHorarioById = async (req, res) => {
  const { horarioId } = req.params;
  const { titulo, dia_semana, hora_inicio, hora_fin, fecha, duracion, Profesores_id } = req.body;

  try {
    // Buscar el horario por su ID
    const horario = await Horario.findByPk(horarioId);
    if (!horario) {
      return res.status(404).json({ error: "Horario no encontrado." });
    }

    // Verificar si se proporcionó un Profesores_id válido
    if (Profesores_id) {
      // Verificar si el Profesores_id existe
      const profesor = await Profesor.findByPk(Profesores_id);
      if (!profesor) {
        return res.status(404).json({ error: "El profesor no existe" });
      }
    }

    // Actualizar el horario con los nuevos valores
    await horario.update({
      titulo,
      dia_semana,
      hora_inicio,
      hora_fin,
      fecha,
      duracion,
      Profesores_id
    });

    res.json({ message: "Horario actualizado correctamente." });
  } catch (error) {
    console.error('Error al actualizar el horario:', error);
    res.status(500).json({ error: "Error al actualizar el horario." });
  }
};

module.exports = {
  getAllHorarios,
  createHorario,
  getHorariosByAlumnoId,
  getHorariosByProfesorId,
  getHorarioById,
  getHorariosByIds,
  deleteHorarioById,
  getHorariosByFecha,
  updateHorarioById // Agregamos el nuevo método de actualización
};
