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
      especialidad, // Recibido como una cadena separada por comas
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

    // Crear el enlace de la sala de reuniones
    const meetingRoomLink =
      "https://meet.jit.si/ProfesorClassroom" + nombre + apellido;

    // Crear el profesor
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
        especialidad, // Guardar la cadena tal como viene del frontend
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
    const { especialidades } = req.query;
    let whereCondition = {};

    if (especialidades) {
      const especialidadesArray = especialidades.split(',').map(palabra =>
        palabra.trim().replace(/[áàäâ]/g, 'a')
                     .replace(/[éèëê]/g, 'e')
                     .replace(/[íìïî]/g, 'i')
                     .replace(/[óòöô]/g, 'o')
                     .replace(/[úùüû]/g, 'u')
                     .replace(/[ñ]/g, 'n')
                     .toLowerCase()
      );

      whereCondition = {
        [Op.or]: especialidadesArray.map(palabra => ({
          especialidad: {
            [Op.iLike]: `%${palabra}%`
          }
        }))
      };
    }

    const profesores = await Profesores.findAll({
      where: whereCondition,
      include: [
        {
          model: Educativos,
          as: 'Educativos',
        },
      ],
    });

    res.json(profesores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al buscar los profesores' });
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
