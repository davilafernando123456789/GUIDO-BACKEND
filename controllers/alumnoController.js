// // controllers/alumnosController.js
// const Alumnos = require('../models/Alumno');
// const Apoderado = require('../models/Apoderado');
const sequelize = require('../config/db');

const Alumno = require('../models/Alumno');
const Apoderado = require('../models/Apoderado');
const Direccion = require('../models/Direccion');


exports.createAlumno = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, usuario, password, nombre, apellido, genero, telefono, fecha_nac, Roles_id, direccion, apoderado } = req.body;

    // Crear la dirección
    const newDireccion = await Direccion.create(direccion, { transaction: t });

    // Asignar la dirección al apoderado
    apoderado.Direccion_id = newDireccion.id;

    // Crear el apoderado
    const newApoderado = await Apoderado.create(apoderado, { transaction: t });

    // Crear el alumno
    const newAlumno = await Alumno.create({
      email,
      usuario,
      password,
      nombre,
      apellido,
      genero,
      telefono,
      fecha_nac,
      Roles_id,
      Apoderado_id: newApoderado.id
    }, { transaction: t });

    // Commit la transacción
    await t.commit();

    res.json(newAlumno);
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al crear el alumno' });
  }
};
// Método para eliminar un alumno por su ID
exports.deleteAlumnoById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    // Buscar el alumno por su ID en la base de datos
    const alumno = await Alumno.findByPk(id, { include: [{ model: Apoderado, as: 'apoderado' }] });

    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    // Eliminar la dirección del apoderado
    await Direccion.destroy({ where: { id: alumno.apoderado.Direccion_id } }, { transaction: t });

    // Eliminar el apoderado
    await Apoderado.destroy({ where: { id: alumno.Apoderado_id } }, { transaction: t });

    // Eliminar el alumno
    await Alumno.destroy({ where: { id } }, { transaction: t });

    // Commit la transacción
    await t.commit();

    res.json({ message: 'Alumno eliminado correctamente' });
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al eliminar el alumno' });
  }
};

///Método para obtener un alumno por su ID
exports.getAlumnoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el alumno por su ID en la base de datos
    const alumno = await Alumno.findByPk(id);

    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    // Enviar el alumno encontrado como respuesta
    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al buscar el alumno' });
  }
};
// Método para obtener todos los alumnos con datos de apoderado y dirección
// Método para obtener todos los alumnos con datos de apoderado y dirección
exports.getAllAlumnos = async (req, res) => {
  try {
    // Buscar todos los alumnos en la base de datos con datos de apoderado y dirección
    const alumnos = await Alumno.findAll({
      include: [
        {
          model: Apoderado,
          as: 'apoderado', // Alias para la asociación con Apoderado
        }
      ]
    });

    // Enviar la lista de alumnos como respuesta
    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al buscar los alumnos' });
  }
};
// Método para actualizar un alumno por su ID
exports.updateAlumnoById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { email, usuario, password, nombre, apellido, genero, telefono, fecha_nac, Roles_id, direccion, apoderado } = req.body;

    // Buscar el alumno por su ID en la base de datos
    const alumno = await Alumno.findByPk(id, { include: [{ model: Apoderado, as: 'apoderado' }] });

    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    // Actualizar los datos del alumno
    await alumno.update({
      email,
      usuario,
      password,
      nombre,
      apellido,
      genero,
      telefono,
      fecha_nac,
      Roles_id,
    }, { transaction: t });

    // Actualizar los datos de la dirección del apoderado
    await Direccion.update(direccion, { where: { id: alumno.apoderado.Direccion_id } }, { transaction: t });

    // Actualizar los datos del apoderado
    await Apoderado.update(apoderado, { where: { id: alumno.Apoderado_id } }, { transaction: t });

    // Commit la transacción
    await t.commit();

    res.json({ message: 'Alumno actualizado correctamente' });
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al actualizar el alumno' });
  }
};
// Método para buscar un alumno por su nombre
exports.getAlumnoByNombre = async (req, res) => {
  try {
    const { nombre } = req.params;

    // Buscar el alumno por su nombre en la base de datos
    const alumnos = await Alumno.findAll({
      where: { nombre },
      include: [
        {
          model: Apoderado,
          as: 'apoderado', // Alias para la asociación con Apoderado
        }
      ]
    });

    if (alumnos.length === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    // Enviar el alumno encontrado como respuesta
    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al buscar el alumno por nombre' });
  }
};


