const Profesores = require("../models/Profesor");
const sequelize = require("../config/db");
const Direccion = require("../models/Direccion");
const Educativos = require("../models/AntecedentesEducativo");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mailer"); // Asegúrate de importar tu archivo mailer
const bcrypt = require("bcrypt");

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

    console.log("Inicio de la transacción para crear un profesor.");

    console.log("Datos de dirección recibidos:", direccion);
    console.log("Datos educativos recibidos:", educativos);

    const existingUser = await Profesores.findOne({ where: { usuario }, transaction: t });
    console.log("Verificación de existencia de usuario:", usuario, " -> ", existingUser ? "Existe" : "No existe");

    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: "El usuario ya existe. Por favor, elige otro nombre de usuario." });
    }

    const existingEmail = await Profesores.findOne({ where: { email }, transaction: t });
    console.log("Verificación de existencia de correo:", email, " -> ", existingEmail ? "Existe" : "No existe");

    if (existingEmail) {
      await t.rollback();
      return res.status(400).json({ message: "El correo electrónico ya está registrado. Por favor, utiliza otro correo." });
    }

    const newDireccion = await Direccion.create(direccion, { transaction: t });
    console.log("Dirección creada con ID:", newDireccion.id);
    
    // Verifica inmediatamente que la dirección exista
    const checkDireccion = await Direccion.findByPk(newDireccion.id, { transaction: t });
    if (!checkDireccion) {
        console.log("Error: Dirección no encontrada después de la creación, ID:", newDireccion.id);
        await t.rollback();
        return res.status(400).json({ message: "Error al crear dirección" });
    } else {
        console.log("Confirmación: Dirección existente con ID:", newDireccion.id);
    }
    const newAntecedenteEducativo = await Educativos.create(educativos, { transaction: t });
    console.log("Antecedente educativo creado con ID:", newAntecedenteEducativo.id);
    //await t.commit();
    console.log("Transacción completada exitosamente.");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Contraseña encriptada.");

    const newProfesor = await Profesores.create({
      email,
      usuario,
      password: hashedPassword,
      nombre,
      apellido,
      genero,
      dni,
      sala: "https://meet.jit.si/ProfesorClassroom" + nombre + apellido,
      especialidad,
      descripcion,
      foto,
      telefono,
      fecha_nac,
      Roles_id,
      Direccion_id: newDireccion.id,
      Antecedentes_educativos_id: newAntecedenteEducativo.id,
    }, { transaction: t });
    console.log("Profesor creado con ID:", newProfesor.id);



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
        <p style="font-size: 16px; margin-bottom: 20px;">Gracias por registrarte como tutor.</p>
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
    // Crear token para profesores
    const token = jwt.sign({ id: newProfesor.id, rol: 2 }, "secreto", {
      expiresIn: "1h",
    });

    await t.commit();
    console.log("Transacción completada exitosamente.");

    res.status(200).json({
      mensaje: "OK",
      rol: 2,
      usuario: {
        id: newProfesor.id,
        email: newProfesor.email,
        nombre: newProfesor.nombre,
        apellido: newProfesor.apellido,
        genero: newProfesor.genero,
        dni: newProfesor.dni,
        telefono: newProfesor.telefono,
        fecha_nac: newProfesor.fecha_nac,
        especialidad: newProfesor.especialidad,
        descripcion: newProfesor.descripcion,
        foto: newProfesor.foto,
        sala: newProfesor.sala,
      },
      token,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error durante la transacción:", error);
    res.status(500).json({ message: "Hubo un error al procesar tu solicitud: " + error.message });
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
      const especialidadesArray = especialidades.split(",").map((palabra) =>
        palabra
          .trim()
          .replace(/[áàäâ]/g, "a")
          .replace(/[éèëê]/g, "e")
          .replace(/[íìïî]/g, "i")
          .replace(/[óòöô]/g, "o")
          .replace(/[úùüû]/g, "u")
          .replace(/[ñ]/g, "n")
          .toLowerCase()
      );

      whereCondition = {
        [Op.or]: especialidadesArray.map((palabra) => ({
          especialidad: {
            [Op.iLike]: `%${palabra}%`,
          },
        })),
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

// exports.createProfesor = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       email,
//       usuario,
//       password,
//       nombre,
//       apellido,
//       dni,
//       genero,
//       telefono,
//       fecha_nac,
//       especialidad,
//       descripcion,
//       foto,
//       Roles_id,
//       direccion,
//       educativos,
//     } = req.body;

//     console.log("Datos de dirección recibidos:", direccion); // Imprimir los datos de dirección

    
//     const existingUser = await Profesores.findOne({
//       where: { usuario },
//       transaction: t,
//     });

//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ message: "El usuario ya existe. Por favor, elige otro nombre de usuario." });
//     }
    
//     const existingEmail = await Profesores.findOne({
//       where: { email },
//       transaction: t,
//     });

//     if (existingEmail) {
//       await t.rollback();
//       return res.status(400).json({ message: "El correo electrónico ya está registrado. Por favor, utiliza otro correo." });
//     }

//     // Crear la dirección
//     const newDireccion = await Direccion.create(direccion, { transaction: t });

//     // Crear el antecedente educativo
//     const newAntecedenteEducativo = await Educativos.create(educativos, {
//       transaction: t,
//     });

//     // Crear el enlace de la sala de reuniones
//     const meetingRoomLink =
//       "https://meet.jit.si/ProfesorClassroom" + nombre + apellido;
//     // Encriptar la contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Crear el profesor
//     const newProfesor = await Profesores.create(
//       {
//         email,
//         usuario,
//         password: hashedPassword,
//         nombre,
//         apellido,
//         genero,
//         dni,
//         sala: meetingRoomLink,
//         especialidad, // Guardar la cadena tal como viene del frontend
//         descripcion,
//         foto,
//         telefono,
//         fecha_nac,
//         Roles_id,
//         Direccion_id: newDireccion.id,
//         Antecedentes_educativos_id: newAntecedenteEducativo.id,
//       },
//       { transaction: t }
//     );
//     // Enviar correo de bienvenida
//     const loginLink = `http://localhost:4200/login`; // Actualiza esto con la URL de tu página de inicio de sesión
//     const emailText = `
//     <div style="font-family: Arial, sans-serif; color: #2C3E50; text-align: center; padding: 20px;">
//       <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//       <br> 
//       <div style="text-align: center; margin-bottom: 20px;">
//           <img src="cid:logo" alt="Logo" style="height: 50px; display: block; margin: 0 auto;">
//           <h1 style="color: #34495E;">Bienvenido/a a GUIDO</h1>
//         </div>
//         <h2 style="color: #5D6D7E; margin-bottom: 20px;">Estimado/a ${nombre} ${apellido},</h2>
//         <p style="font-size: 16px; margin-bottom: 20px;">Gracias por registrarte como tutor.</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">Para acceder a tu cuenta, por favor inicia sesión en nuestra plataforma:</p>
//         <a href="${loginLink}" style="font-size: 16px; background-color: #1C1678; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Iniciar Sesión</a>
//         <p style="font-size: 16px; margin-top: 20px;">Saludos,</p>
//         <p style="font-size: 16px; color: #1C1678;">El equipo de GUIDO</p>
//       </div>
//     </div>
//   `;

//     sendEmail(email, "Bienvenido a GUIDO", emailText, [
//       {
//         filename: "logo.png",
//         path: "./images/logo.png",
//         cid: "logo", // Este ID debe coincidir con el cid en el src de la etiqueta img
//       },
//     ]);
//     // Crear token para profesores
//     const token = jwt.sign({ id: newProfesor.id, rol: 2 }, "secreto", {
//       expiresIn: "1h",
//     });

//     // Confirmar la transacción
//     await t.commit();

//     res.status(200).json({
//       mensaje: "OK",
//       rol: 2,
//       usuario: {
//         id: newProfesor.id,
//         email: newProfesor.email,
//         nombre: newProfesor.nombre,
//         apellido: newProfesor.apellido,
//         genero: newProfesor.genero,
//         dni: newProfesor.dni,
//         telefono: newProfesor.telefono,
//         fecha_nac: newProfesor.fecha_nac,
//         especialidad: newProfesor.especialidad,
//         descripcion: newProfesor.descripcion,
//         foto: newProfesor.foto,
//         sala: newProfesor.sala,
//       },
//       token,
//     });
//   } catch (error) {
//     await t.rollback();
//     console.error(error);
//     res.status(500).json({ message: "Hubo un error al procesar tu solicitud: " + error.message });
//   }
// };
// exports.updateProfesorById = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const {
//       email,
//       usuario,
//       nombre,
//       apellido,
//       dni,
//       genero,
//       telefono,
//       fecha_nac,
//       especialidad,
//       descripcion,
//       foto,
//       Roles_id,
//     } = req.body;

//     // Buscar el profesor por su ID en la base de datos
//     const profesor = await Profesores.findByPk(id);

//     if (!profesor) {
//       return res.status(404).json({ message: "Profesor no encontrado" });
//     }

//     // Actualizar los datos del profesor
//     await profesor.update(
//       {
//         email,
//         usuario,
//         nombre,
//         apellido,
//         dni,
//         genero,
//         telefono,
//         fecha_nac,
//         especialidad,
//         descripcion,
//         foto,
//         Roles_id,
//       },
//       { transaction: t }
//     );

//     // Commit la transacción
//     await t.commit();
//     res.json({ message: "Profesor actualizado correctamente" });
//   } catch (error) {
//     // Rollback si hay un error
//     await t.rollback();
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Hubo un error al actualizar el profesor" });
//   }
// };

// exports.createProfesor = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       email,
//       usuario,
//       password,
//       nombre,
//       apellido,
//       dni,
//       genero,
//       telefono,
//       fecha_nac,
//       especialidad, // Recibido como una cadena separada por comas
//       descripcion,
//       foto,
//       Roles_id,
//       direccion,
//       educativos,
//     } = req.body;

//     // Crear la dirección
//     const newDireccion = await Direccion.create(direccion, { transaction: t });

//     // Crear el antecedente educativo
//     const newAntecedenteEducativo = await Educativos.create(educativos, {
//       transaction: t,
//     });

//     // Crear el enlace de la sala de reuniones
//     const meetingRoomLink =
//       "https://meet.jit.si/ProfesorClassroom" + nombre + apellido;

//     // Crear el profesor
//     const newProfesor = await Profesores.create(
//       {
//         email,
//         usuario,
//         password,
//         nombre,
//         apellido,
//         genero,
//         dni,
//         sala: meetingRoomLink,
//         especialidad, // Guardar la cadena tal como viene del frontend
//         descripcion,
//         foto,
//         telefono,
//         fecha_nac,
//         Roles_id,
//         Direccion_id: newDireccion.id,
//         Antecedentes_educativos_id: newAntecedenteEducativo.id,
//       },
//       { transaction: t }
//     );

//     // Crear token para profesores
//     const token = jwt.sign({ id: newProfesor.id, rol: 2 }, "secreto", {
//       expiresIn: "1h",
//     });

//     // Confirmar la transacción
//     await t.commit();

//     res.status(200).json({
//       mensaje: "OK",
//       rol: 2,
//       usuario: {
//         id: newProfesor.id,
//         email: newProfesor.email,
//         nombre: newProfesor.nombre,
//         apellido: newProfesor.apellido,
//         genero: newProfesor.genero,
//         dni: newProfesor.dni,
//         telefono: newProfesor.telefono,
//         fecha_nac: newProfesor.fecha_nac,
//         especialidad: newProfesor.especialidad,
//         descripcion: newProfesor.descripcion,
//         foto: newProfesor.foto,
//         sala: newProfesor.sala,
//       },
//       token,
//     });
//   } catch (error) {
//     // Revertir la transacción en caso de error
//     await t.rollback();
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Hubo un error al crear el profesor" });
//   }
// };

// exports.createProfesor = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       email,
//       usuario,
//       password,
//       nombre,
//       apellido,
//       dni,
//       genero,
//       telefono,
//       fecha_nac,
//       especialidad, // Recibido como una cadena separada por comas
//       descripcion,
//       foto,
//       Roles_id,
//       direccion,
//       educativos,
//     } = req.body;

//     // Crear la dirección
//     const newDireccion = await Direccion.create(direccion, { transaction: t });

//     // Crear el antecedente educativo
//     const newAntecedenteEducativo = await Educativos.create(educativos, {
//       transaction: t,
//     });

//     // Crear el enlace de la sala de reuniones
//     const meetingRoomLink =
//       "https://meet.jit.si/ProfesorClassroom" + nombre + apellido;

//     // Crear el profesor
//     const newProfesor = await Profesores.create(
//       {
//         email,
//         usuario,
//         password,
//         nombre,
//         apellido,
//         genero,
//         dni,
//         sala: meetingRoomLink,
//         especialidad, // Guardar la cadena tal como viene del frontend
//         descripcion,
//         foto,
//         telefono,
//         fecha_nac,
//         Roles_id,
//         Direccion_id: newDireccion.id,
//         Antecedentes_educativos_id: newAntecedenteEducativo.id,
//       },
//       { transaction: t }
//     );

//     // Crear token para profesores
//     const token = jwt.sign({ id: newProfesor.id, rol: 2 }, "secreto", {
//       expiresIn: "1h",
//     });

//     // Confirmar la transacción
//     await t.commit();

//     res.status(200).json({
//       mensaje: "OK",
//       rol: 2,
//       usuario: {
//         id: newProfesor.id,
//         email: newProfesor.email,
//         nombre: newProfesor.nombre,
//         // Agrega otros campos del profesor que desees devolver
//       },
//       token,
//     });
//   } catch (error) {
//     // Revertir la transacción en caso de error
//     await t.rollback();
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Hubo un error al crear el profesor" });
//   }
// };

// exports.updateProfesorById = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const {
//       email,
//       usuario,
//       nombre,
//       apellido,
//       dni,
//       genero,
//       telefono,
//       fecha_nac,
//       especialidad,
//       descripcion,
//       foto,
//       Roles_id,
//     } = req.body;

//     // Buscar el profesor por su ID en la base de datos
//     const profesor = await Profesores.findByPk(id);

//     if (!profesor) {
//       return res.status(404).json({ message: "Profesor no encontrado" });
//     }

//     // Actualizar los datos del profesor
//     await profesor.update(
//       {
//         email,
//         usuario,
//         nombre,
//         apellido,
//         dni,
//         genero,
//         telefono,
//         fecha_nac,
//         especialidad,
//         descripcion,
//         foto,
//         Roles_id,
//       },
//       { transaction: t }
//     );

//     // Commit la transacción
//     await t.commit();
//     res.json({ message: "Profesor actualizado correctamente" });
//   } catch (error) {
//     // Rollback si hay un error
//     await t.rollback();
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Hubo un error al actualizar el profesor" });
//   }
// };

// exports.createProfesor = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       email,
//       usuario,
//       password,
//       nombre,
//       apellido,
//       dni,
//       genero,
//       telefono,
//       fecha_nac,
//       especialidad, // Recibido como una cadena separada por comas
//       descripcion,
//       foto,
//       Roles_id,
//       direccion,
//       educativos,
//     } = req.body;

//     // Crear la dirección
//     const newDireccion = await Direccion.create(direccion, { transaction: t });

//     // Crear el antecedente educativo
//     const newAntecedenteEducativo = await Educativos.create(educativos, {
//       transaction: t,
//     });

//     // Crear el enlace de la sala de reuniones
//     const meetingRoomLink =
//       "https://meet.jit.si/ProfesorClassroom" + nombre + apellido;

//     // Crear el profesor
//     const newProfesor = await Profesores.create(
//       {
//         email,
//         usuario,
//         password,
//         nombre,
//         apellido,
//         genero,
//         dni,
//         sala: meetingRoomLink,
//         especialidad, // Guardar la cadena tal como viene del frontend
//         descripcion,
//         foto,
//         telefono,
//         fecha_nac,
//         Roles_id,
//         Direccion_id: newDireccion.id,
//         Antecedentes_educativos_id: newAntecedenteEducativo.id,
//       },
//       { transaction: t }
//     );
//     // Enviar correo de bienvenida
//     const loginLink = `http://localhost:4200/login`; // Actualiza esto con la URL de tu página de inicio de sesión
//     const emailText = `
//     <div style="font-family: Arial, sans-serif; color: #2C3E50; text-align: center; padding: 20px;">
//       <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//       <br>
//       <div style="text-align: center; margin-bottom: 20px;">
//           <img src="cid:logo" alt="Logo" style="height: 50px; display: block; margin: 0 auto;">
//           <h1 style="color: #34495E;">Bienvenido/a a GUIDO</h1>
//         </div>
//         <h2 style="color: #5D6D7E; margin-bottom: 20px;">Estimado/a ${nombre} ${apellido},</h2>
//         <p style="font-size: 16px; margin-bottom: 20px;">Gracias por registrarte como tutor.</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">Para acceder a tu cuenta, por favor inicia sesión en nuestra plataforma:</p>
//         <a href="${loginLink}" style="font-size: 16px; background-color: #1C1678; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Iniciar Sesión</a>
//         <p style="font-size: 16px; margin-top: 20px;">Saludos,</p>
//         <p style="font-size: 16px; color: #1C1678;">El equipo de GUIDO</p>
//       </div>
//     </div>
//   `;

//   sendEmail(email, 'Bienvenido a GUIDO', emailText, [{
//     filename: 'logo.png',
//     path: './images/logo.png',
//     cid: 'logo' // Este ID debe coincidir con el cid en el src de la etiqueta img
//   }]);
//     // Crear token para profesores
//     const token = jwt.sign({ id: newProfesor.id, rol: 2 }, "secreto", {
//       expiresIn: "1h",
//     });

//     // Confirmar la transacción
//     await t.commit();

//     res.status(200).json({
//       mensaje: "OK",
//       rol: 2,
//       usuario: {
//         id: newProfesor.id,
//         email: newProfesor.email,
//         nombre: newProfesor.nombre,
//         apellido: newProfesor.apellido,
//         genero: newProfesor.genero,
//         dni: newProfesor.dni,
//         telefono: newProfesor.telefono,
//         fecha_nac: newProfesor.fecha_nac,
//         especialidad: newProfesor.especialidad,
//         descripcion: newProfesor.descripcion,
//         foto: newProfesor.foto,
//         sala: newProfesor.sala,
//       },
//       token,
//     });
//   } catch (error) {
//     // Revertir la transacción en caso de error
//     await t.rollback();
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Hubo un error al crear el profesor" });
//   }
// };



// exports.createProfesor = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       email,
//       usuario,
//       password,
//       nombre,
//       apellido,
//       dni,
//       genero,
//       telefono,
//       fecha_nac,
//       especialidad,
//       descripcion,
//       foto,
//       Roles_id,
//       direccion,
//       educativos,
//     } = req.body;
//     const existingUser = await Profesores.findOne({
//       where: { usuario },
//       transaction: t,
//     });

//     if (existingUser) {
//       await t.rollback();
//       return res.status(400).json({ message: "El usuario ya existe" });
//     }

//     const existingEmail = await Profesores.findOne({
//       where: { email },
//       transaction: t,
//     });

//     if (existingEmail) {
//       await t.rollback();
//       return res.status(400).json({ message: "El correo ya existe" });
//     }

//     // Crear la dirección
//     const newDireccion = await Direccion.create(direccion, { transaction: t });

//     // Crear el antecedente educativo
//     const newAntecedenteEducativo = await Educativos.create(educativos, {
//       transaction: t,
//     });

//     // Crear el enlace de la sala de reuniones
//     const meetingRoomLink =
//       "https://meet.jit.si/ProfesorClassroom" + nombre + apellido;
//     // Encriptar la contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Crear el profesor
//     const newProfesor = await Profesores.create(
//       {
//         email,
//         usuario,
//         password: hashedPassword,
//         nombre,
//         apellido,
//         genero,
//         dni,
//         sala: meetingRoomLink,
//         especialidad, // Guardar la cadena tal como viene del frontend
//         descripcion,
//         foto,
//         telefono,
//         fecha_nac,
//         Roles_id,
//         Direccion_id: newDireccion.id,
//         Antecedentes_educativos_id: newAntecedenteEducativo.id,
//       },
//       { transaction: t }
//     );
//     // Enviar correo de bienvenida
//     const loginLink = `http://localhost:4200/login`; // Actualiza esto con la URL de tu página de inicio de sesión
//     const emailText = `
//     <div style="font-family: Arial, sans-serif; color: #2C3E50; text-align: center; padding: 20px;">
//       <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//       <br> 
//       <div style="text-align: center; margin-bottom: 20px;">
//           <img src="cid:logo" alt="Logo" style="height: 50px; display: block; margin: 0 auto;">
//           <h1 style="color: #34495E;">Bienvenido/a a GUIDO</h1>
//         </div>
//         <h2 style="color: #5D6D7E; margin-bottom: 20px;">Estimado/a ${nombre} ${apellido},</h2>
//         <p style="font-size: 16px; margin-bottom: 20px;">Gracias por registrarte como tutor.</p>
//         <p style="font-size: 16px; margin-bottom: 20px;">Para acceder a tu cuenta, por favor inicia sesión en nuestra plataforma:</p>
//         <a href="${loginLink}" style="font-size: 16px; background-color: #1C1678; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Iniciar Sesión</a>
//         <p style="font-size: 16px; margin-top: 20px;">Saludos,</p>
//         <p style="font-size: 16px; color: #1C1678;">El equipo de GUIDO</p>
//       </div>
//     </div>
//   `;

//     sendEmail(email, "Bienvenido a GUIDO", emailText, [
//       {
//         filename: "logo.png",
//         path: "./images/logo.png",
//         cid: "logo", // Este ID debe coincidir con el cid en el src de la etiqueta img
//       },
//     ]);
//     // Crear token para profesores
//     const token = jwt.sign({ id: newProfesor.id, rol: 2 }, "secreto", {
//       expiresIn: "1h",
//     });

//     // Confirmar la transacción
//     await t.commit();

//     res.status(200).json({
//       mensaje: "OK",
//       rol: 2,
//       usuario: {
//         id: newProfesor.id,
//         email: newProfesor.email,
//         nombre: newProfesor.nombre,
//         apellido: newProfesor.apellido,
//         genero: newProfesor.genero,
//         dni: newProfesor.dni,
//         telefono: newProfesor.telefono,
//         fecha_nac: newProfesor.fecha_nac,
//         especialidad: newProfesor.especialidad,
//         descripcion: newProfesor.descripcion,
//         foto: newProfesor.foto,
//         sala: newProfesor.sala,
//       },
//       token,
//     });
//   } catch (error) {
//     // Revertir la transacción en caso de error
//     await t.rollback();
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Hubo un error al crear el profesor" });
//   }
// };
