const Suscripcion = require("../models/Suscripcion");
const sequelize = require("../config/db");

const Alumno = require("../models/Alumno");
const Profesor = require("../models/Profesor");
const Apoderado = require("../models/Apoderado");
const Direccion = require("../models/Direccion");
const { Op } = require("sequelize");

exports.guardarSuscripcion = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { usuarioId, rol, tipo_suscripcion } = req.body;
  console.log(usuarioId, rol, tipo_suscripcion)
      // Calcular las fechas de inicio y fin de la suscripción
      const fecha_inicio = new Date();
      let fecha_fin;
      switch (tipo_suscripcion) {
        case "Mensual":
          fecha_fin = new Date(fecha_inicio);
          fecha_fin.setMonth(fecha_fin.getMonth() + 1);
          break;
        case "Trimestral":
          fecha_fin = new Date(fecha_inicio);
          fecha_fin.setMonth(fecha_fin.getMonth() + 3);
          break;
        case "Anual":
          fecha_fin = new Date(fecha_inicio);
          fecha_fin.setFullYear(fecha_fin.getFullYear() + 1);
          break;
        default:
          throw new Error("Tipo de suscripción no válido");
      }
  
      // Crear la nueva suscripción
      const nuevaSuscripcion = await Suscripcion.create(
        {
          tipo_suscripcion,
          fecha_inicio,
          fecha_fin,
        },
        { transaction: t }
      );
  
      // Asociar la suscripción al usuario correspondiente (alumno o profesor)
      const Modelo = rol === '1' ? Alumno : Profesor;
      await Modelo.update(
        { Suscripcion_id: nuevaSuscripcion.id },
        { where: { id: usuarioId }, transaction: t }
      );
  
      // Commit la transacción
      await t.commit();
      res.status(201).json(nuevaSuscripcion);
    } catch (error) {
      // Rollback si hay un error
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: "Hubo un error al guardar la suscripción" });
    }
  };

exports.verificarSuscripcion = async (req, res) => {
    try {
      const { usuarioId, rol } = req.params;
      const Modelo = rol === '1' ? Alumno : Profesor;
      const usuario = await Modelo.findByPk(usuarioId, {
        include: {
          model: Suscripcion,
          as: 'suscripcion'
        }
      });
  
      if (!usuario || !usuario.Suscripcion_id) {
        return res.status(200).send(false);
      }
  
      const suscripcion = await Suscripcion.findByPk(usuario.Suscripcion_id);
      const hoy = new Date();
      const fechaFin = new Date(suscripcion.fecha_fin); // Convertir fecha_fin a objeto Date
  
      if (fechaFin.getTime() >= hoy.getTime()) {
        return res.status(200).send(true);
      } else {
        return res.status(200).send(false);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al verificar la suscripción' });
    }
  };

//   exports.guardarSuscripcion = async (req, res) => {
//     const t = await sequelize.transaction();
//     try {
//       const { Alumno_id, tipo_suscripcion } = req.body;
  
//       // Calcular las fechas de inicio y fin de la suscripción
//       const fecha_inicio = new Date();
//       let fecha_fin;
  
//       switch (tipo_suscripcion) {
//         case "Mensual":
//           fecha_fin = new Date(fecha_inicio);
//           fecha_fin.setMonth(fecha_fin.getMonth() + 1);
//           break;
//         case "Trimestral":
//           fecha_fin = new Date(fecha_inicio);
//           fecha_fin.setMonth(fecha_fin.getMonth() + 3);
//           break;
//         case "Anual":
//           fecha_fin = new Date(fecha_inicio);
//           fecha_fin.setFullYear(fecha_fin.getFullYear() + 1);
//           break;
//         default:
//           throw new Error("Tipo de suscripción no válido");
//       }
  
//       // Crear la nueva suscripción
//       const nuevaSuscripcion = await Suscripcion.create(
//         {
//           tipo_suscripcion,
//           fecha_inicio,
//           fecha_fin,
//         },
//         { transaction: t }
//       );
  
//       // Asociar la suscripción al alumno
//       await Alumno.update(
//         { Suscripcion_id: nuevaSuscripcion.id },
//         { where: { id: Alumno_id }, transaction: t }
//       );
  
//       // Commit la transacción
//       await t.commit();
  
//       res.status(201).json(nuevaSuscripcion);
//     } catch (error) {
//       // Rollback si hay un error
//       await t.rollback();
//       console.error(error);
//       res
//         .status(500)
//         .json({ message: "Hubo un error al guardar la suscripción" });
//     }
//   };
  
