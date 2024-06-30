// // controllers/alumnosController.js
const Suscripcion = require("../models/Suscripcion");
const sequelize = require("../config/db");

const Alumno = require("../models/Alumno");
const Apoderado = require("../models/Apoderado");
const Direccion = require("../models/Direccion");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mailer");
const bcrypt = require("bcrypt");

// exports.createAlumno = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { email, usuario, password, nombre, apellido, genero, telefono, fecha_nac, Roles_id, direccion, apoderado } = req.body;

//     // Crear la dirección
//     const newDireccion = await Direccion.create(direccion, { transaction: t });

//     // Asignar la dirección al apoderado
//     apoderado.Direccion_id = newDireccion.id;

//     // Crear el apoderado
//     const newApoderado = await Apoderado.create(apoderado, { transaction: t });

//     // Crear el alumno
//     const newAlumno = await Alumno.create({
//       email,
//       usuario,
//       password,
//       nombre,
//       apellido,
//       genero,
//       telefono,
//       fecha_nac,
//       Roles_id,
//       Apoderado_id: newApoderado.id
//     }, { transaction: t });

//     // Commit la transacción
//     await t.commit();

//     res.json(newAlumno);
//   } catch (error) {
//     // Rollback si hay un error
//     await t.rollback();
//     console.error(error);
//     res.status(500).json({ message: 'Hubo un error al crear el alumno' });
//   }
// };
exports.createAlumno = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      email,
      usuario,
      password,
      nombre,
      apellido,
      genero,
      telefono,
      fecha_nac,
      Roles_id,
      direccion,
      apoderado,
    } = req.body;

    // Crear la dirección
    const newDireccion = await Direccion.create(direccion, { transaction: t });

    // Asignar la dirección al apoderado
    apoderado.Direccion_id = newDireccion.id;

    // Crear el apoderado
    const newApoderado = await Apoderado.create(apoderado, { transaction: t });
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hash generado:', hashedPassword);
    // Crear el alumno
    const newAlumno = await Alumno.create(
      {
        email,
        usuario,
        password: hashedPassword,
        nombre,
        apellido,
        genero,
        telefono,
        fecha_nac,
        Roles_id,
        Apoderado_id: newApoderado.id,
      },
      { transaction: t }
    );
    // Enviar correo de bienvenida
    const loginLink = `http://localhost:4200/login`; // Actualiza esto con la URL de tu página de inicio de sesión
    const emailText = `
    <div style="font-family: Arial, sans-serif; color: #2C3E50; text-align: center; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <br> 
      <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="Logo" style="height: 50px; display: block; margin: 0 auto;">
          <h1 style="color: #34495E;">Bienvenido/a a GUIDO</h1>
        </div>
        <h2 style="color: #5D6D7E; margin-bottom: 20px;">Estimado/a ${nombre} ${apellido},</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">Gracias por registrarte como estudiante.</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Para acceder a tu cuenta, por favor inicia sesión en nuestra plataforma:</p>
        <a href="${loginLink}" style="font-size: 16px; background-color: #1C1678; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Iniciar Sesión</a>
        <p style="font-size: 16px; margin-top: 20px;">Saludos,</p>
        <p style="font-size: 16px; color: #1C1678;">El equipo de GUIDO</p>
      </div>
    </div>
  `;

    sendEmail(email, "Bienvenido a GUIDO", emailText, [
      {
        filename: "logo.png",
        path: "./images/logo.png",
        cid: "logo", // Este ID debe coincidir con el cid en el src de la etiqueta img
      },
    ]);

    // sendEmail(email, "Bienvenido a GUIDO", emailText);
    // Crear token para alumnos
    const token = jwt.sign({ id: newAlumno.id, rol: 1 }, "secreto", {
      expiresIn: "1h",
    });

    // Confirmar la transacción
    await t.commit();

    res.status(200).json({
      mensaje: "OK",
      rol: 1,
      usuario: {
        id: newAlumno.id,
        email: newAlumno.email,
        nombre: newAlumno.nombre,
        apellido: newAlumno.apellido,
        genero: newAlumno.genero,
        telefono: newAlumno.telefono,
        fecha_nac: newAlumno.fecha_nac,
        direccion: newDireccion,
        apoderado: newApoderado,
      },
      token,
    });
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Hubo un error al crear el alumno" });
  }
};
exports.deleteAlumnoById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    // Buscar el alumno por su ID en la base de datos
    const alumno = await Alumno.findByPk(id, {
      include: [{ model: Apoderado, as: "apoderado" }],
    });

    if (!alumno) {
      await t.rollback();
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Eliminar la dirección del apoderado si existe
    if (alumno.apoderado && alumno.apoderado.Direccion_id) {
      try {
        await Direccion.destroy(
          { where: { id: alumno.apoderado.Direccion_id } },
          { transaction: t }
        );
      } catch (error) {
        console.warn(
          `No se pudo eliminar la dirección con ID ${alumno.apoderado.Direccion_id}: ${error.message}`
        );
      }
    }

    // Eliminar el apoderado si existe
    if (alumno.Apoderado_id) {
      try {
        await Apoderado.destroy(
          { where: { id: alumno.Apoderado_id } },
          { transaction: t }
        );
      } catch (error) {
        console.warn(
          `No se pudo eliminar el apoderado con ID ${alumno.Apoderado_id}: ${error.message}`
        );
      }
    }

    // Eliminar el alumno
    await Alumno.destroy({ where: { id } }, { transaction: t });

    // Commit la transacción
    await t.commit();

    res.json({ message: "Alumno eliminado correctamente" });
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Hubo un error al eliminar el alumno" });
  }
};

// exports.deleteAlumnoById = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;

//     // Buscar el alumno por su ID en la base de datos
//     const alumno = await Alumno.findByPk(id, {
//       include: [{ model: Apoderado, as: "apoderado" }],
//     });

//     if (!alumno) {
//       return res.status(404).json({ message: "Alumno no encontrado" });
//     }

//     // Actualizar el ID del apoderado del alumno a null
//     await alumno.update({ Apoderado_id: null }, { transaction: t });

//     // Eliminar la dirección del apoderado
//     await Direccion.destroy(
//       { where: { id: alumno.apoderado.Direccion_id } },
//       { transaction: t }
//     );

//     // Eliminar el apoderado
//     await Apoderado.destroy(
//       { where: { id: alumno.Apoderado_id } },
//       { transaction: t }
//     );

//     // Eliminar el alumno
//     await Alumno.destroy({ where: { id } }, { transaction: t });

//     // Commit la transacción
//     await t.commit();

//     res.json({ message: "Alumno eliminado correctamente" });
//   } catch (error) {
//     // Rollback si hay un error
//     await t.rollback();
//     console.error(error);
//     res.status(500).json({ message: "Hubo un error al eliminar el alumno" });
//   }
// };

///Método para obtener un alumno por su ID
exports.getAlumnoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el alumno por su ID en la base de datos
    const alumno = await Alumno.findByPk(id);

    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Enviar el alumno encontrado como respuesta
    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al buscar el alumno" });
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
          as: "apoderado", // Alias para la asociación con Apoderado
        },
      ],
    });

    // Enviar la lista de alumnos como respuesta
    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al buscar los alumnos" });
  }
};
// Método para actualizar un alumno por su ID
exports.updateAlumnoById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      email,
      usuario,
      password,
      nombre,
      apellido,
      genero,
      telefono,
      fecha_nac,
      Roles_id,
      direccion,
      apoderado,
    } = req.body;

    // Buscar el alumno por su ID en la base de datos
    const alumno = await Alumno.findByPk(id, {
      include: [{ model: Apoderado, as: "apoderado" }],
    });

    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Actualizar los datos del alumno
    await alumno.update(
      {
        email,
        usuario,
        password,
        nombre,
        apellido,
        genero,
        telefono,
        fecha_nac,
        Roles_id,
      },
      { transaction: t }
    );

    // Actualizar los datos de la dirección del apoderado
    await Direccion.update(
      direccion,
      { where: { id: alumno.apoderado.Direccion_id } },
      { transaction: t }
    );

    // Actualizar los datos del apoderado
    await Apoderado.update(
      apoderado,
      { where: { id: alumno.Apoderado_id } },
      { transaction: t }
    );

    // Commit la transacción
    await t.commit();

    res.json({ message: "Alumno actualizado correctamente" });
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Hubo un error al actualizar el alumno" });
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
          as: "apoderado", // Alias para la asociación con Apoderado
        },
      ],
    });

    if (alumnos.length === 0) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Enviar el alumno encontrado como respuesta
    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Hubo un error al buscar el alumno por nombre" });
  }
};
