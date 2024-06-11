const Reporte = require("../models/Reporte"); // Asegúrate de importar tu modelo de Reporte
const Alumno = require("../models/Alumno"); // Asegúrate de importar tu modelo de Alumno
const Apoderado = require("../models/Apoderado"); // Asegúrate de importar tu modelo de Apoderado
const Profesor = require("../models/Profesor"); // Asegúrate de importar tu modelo de Profesor
const sendEmail = require("../utils/mailer"); // Asegúrate de importar tu archivo mailer

exports.createReport = async (req, res) => {
  console.log("Request body:", req.body); // Log del cuerpo de la solicitud
  try {
    const reporte = await Reporte.create(req.body);
    console.log("Reporte creado exitosamente:", reporte); // Log del reporte creado exitosamente

    // Obtener información del alumno y del apoderado
    const alumno = await Alumno.findByPk(reporte.Alumno_id);
    if (!alumno) {
      throw new Error("Alumno no encontrado");
    }

    const apoderado = await Apoderado.findByPk(alumno.Apoderado_id);
    if (!apoderado) {
      throw new Error("Apoderado no encontrado");
    }

    // Obtener información del profesor
    const profesor = await Profesor.findByPk(reporte.Profesor_id);
    if (!profesor) {
      throw new Error("Profesor no encontrado");
    }

    // Enviar correo electrónico al apoderado
    //   const emailText = `
    //   <div style="font-family: Arial, sans-serif; color: #2C3E50; text-align: center; padding: 20px;">
    //     <h1 style="color: #34495E; margin-bottom: 10px;">Nuevo Reporte Generado</h1>
    //     <h2 style="color: #5D6D7E; margin-bottom: 20px;">Estimado/a ${apoderado.nombre},</h2>
    //     <p style="font-size: 16px; margin-bottom: 20px;">
    //       Se ha generado un nuevo reporte para su hijo/a <strong>${alumno.nombre} ${alumno.apellido}</strong>.
    //     </p>
    //     <h3 style="color: #2C3E50; margin-bottom: 20px;">Detalles del reporte:</h3>
    //     <ul style="font-size: 16px; list-style-type: none; padding: 0; text-align: left; display: inline-block;">
    //       <li style="margin-bottom: 5px;"><strong>Asistencia:</strong> ${reporte.asistencia ? 'Sí' : 'No'}</li>
    //       <li style="margin-bottom: 5px;"><strong>Participación:</strong> ${reporte.participacion ? 'Sí' : 'No'}</li>
    //       <li style="margin-bottom: 5px;"><strong>Comprensión:</strong> ${reporte.comprension ? 'Sí' : 'No'}</li>
    //       <li style="margin-bottom: 5px;"><strong>Comportamiento:</strong> ${reporte.comportamiento ? 'Adecuado' : 'Inadecuado'}</li>
    //       <li style="margin-bottom: 5px;"><strong>Observaciones:</strong> ${reporte.observaciones}</li>
    //       <li style="margin-bottom: 5px;"><strong>Recomendaciones:</strong> ${reporte.recomendaciones}</li>
    //     </ul>
    //     <p style="font-size: 16px; margin-top: 20px;">Saludos,</p>
    //     <p style="font-size: 16px; color: #1C1678;">GUIDO</p>
    //     <p style="font-size: 16px; color: #2C3E50;"><em>Tutor: ${profesor.nombre} ${profesor.apellido}</em></p>
    //   </div>
    // `;

    //   sendEmail(apoderado.email, 'Nuevo Reporte Generado', emailText);
    const emailText = `
    <div style="font-family: Arial, sans-serif; color: #2C3E50; text-align: center; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="Logo" style="height: 50px; display: block; margin: 0 auto;">
          <h1 style="color: #34495E;">Nuevo Reporte Generado</h1>
        </div>
        <h2 style="color: #5D6D7E; margin-bottom: 20px;">Estimado/a ${apoderado.nombre},</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          Se ha generado un nuevo reporte para su hijo/a <strong>${alumno.nombre} ${alumno.apellido}</strong>.
        </p>
        <h3 style="color: #2C3E50; margin-bottom: 20px;">Detalles del reporte:</h3>
        <ul style="font-size: 16px; list-style-type: none; padding: 0; text-align: left; display: inline-block;">
          <li style="margin-bottom: 5px;"><strong>Asistencia:</strong> ${reporte.asistencia ? 'Sí' : 'No'}</li>
          <li style="margin-bottom: 5px;"><strong>Participación:</strong> ${reporte.participacion ? 'Sí' : 'No'}</li>
          <li style="margin-bottom: 5px;"><strong>Comprensión:</strong> ${reporte.comprension ? 'Sí' : 'No'}</li>
          <li style="margin-bottom: 5px;"><strong>Comportamiento:</strong> ${reporte.comportamiento ? 'Adecuado' : 'Inadecuado'}</li>
          <li style="margin-bottom: 5px;"><strong>Observaciones:</strong> ${reporte.observaciones}</li>
          <li style="margin-bottom: 5px;"><strong>Recomendaciones:</strong> ${reporte.recomendaciones}</li>
        </ul>
        <p style="font-size: 16px; margin-top: 20px;">Saludos,</p>
        <p style="font-size: 16px; color: #1C1678;">GUIDO</p>
        <p style="font-size: 16px; color: #2C3E50;"><em>Tutor: ${profesor.nombre} ${profesor.apellido}</em></p>
      </div>
    </div>
  `;
  
  sendEmail(apoderado.email, 'Nuevo Reporte Generado', emailText, [{
    filename: 'logo.png',
    path: './images/logo.png',
    cid: 'logo' // Este ID debe coincidir con el cid en el src de la etiqueta img
  }]);
  

    res.status(201).json(reporte);
  } catch (error) {
    console.error("Error al crear el reporte:", error); // Log del error ocurrido
    res.status(400).json({ error: error.message });
  }
};

// exports.createReport = async (req, res) => {
//     console.log('Request body:', req.body); // Log del cuerpo de la solicitud
//     try {
//       const reporte = await Reporte.create(req.body);
//       console.log('Reporte creado exitosamente:', reporte); // Log del reporte creado exitosamente
//       res.status(201).json(reporte);
//     } catch (error) {
//       console.error('Error al crear el reporte:', error); // Log del error ocurrido
//       res.status(400).json({ error: error.message });
//     }
//   };

exports.getReports = async (req, res) => {
  try {
    const reportes = await Reporte.findAll();
    res.status(200).json(reportes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const reporte = await Reporte.findByPk(req.params.id);
    if (reporte) {
      res.status(200).json(reporte);
    } else {
      res.status(404).json({ message: "Reporte no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const [updated] = await Reporte.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedReporte = await Reporte.findByPk(req.params.id);
      res.status(200).json(updatedReporte);
    } else {
      res.status(404).json({ message: "Reporte no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const deleted = await Reporte.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Reporte no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
