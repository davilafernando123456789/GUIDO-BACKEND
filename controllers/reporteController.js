const Reporte = require('../models/Reporte'); // Asegúrate de importar tu modelo de Reporte
const Alumno = require('../models/Alumno'); // Asegúrate de importar tu modelo de Alumno
const Apoderado = require('../models/Apoderado'); // Asegúrate de importar tu modelo de Apoderado
const Profesor = require('../models/Profesor'); // Asegúrate de importar tu modelo de Profesor
const sendEmail = require('../utils/mailer'); // Asegúrate de importar tu archivo mailer

exports.createReport = async (req, res) => {
  console.log('Request body:', req.body); // Log del cuerpo de la solicitud
  try {
    const reporte = await Reporte.create(req.body);
    console.log('Reporte creado exitosamente:', reporte); // Log del reporte creado exitosamente

    // Obtener información del alumno y del apoderado
    const alumno = await Alumno.findByPk(reporte.Alumno_id);
    if (!alumno) {
      throw new Error('Alumno no encontrado');
    }

    const apoderado = await Apoderado.findByPk(alumno.Apoderado_id);
    if (!apoderado) {
      throw new Error('Apoderado no encontrado');
    }

    // Obtener información del profesor
    const profesor = await Profesor.findByPk(reporte.Profesor_id);
    if (!profesor) {
      throw new Error('Profesor no encontrado');
    }

    // Enviar correo electrónico al apoderado
    const emailText = `
      <p>Estimado/a ${apoderado.nombre},</p>
      <p>Se ha generado un nuevo reporte para su hijo/a <strong>${alumno.nombre} ${alumno.apellido}</strong>.</p>
      <h3>Detalles del reporte:</h3>
      <ul>
        <li><strong>Asistencia:</strong> ${reporte.asistencia ? 'Sí' : 'No'}</li>
        <li><strong>Participación:</strong> ${reporte.participacion ? 'Sí' : 'No'}</li>
        <li><strong>Comprensión:</strong> ${reporte.comprension ? 'Sí' : 'No'}</li>
        <li><strong>Comportamiento:</strong> ${reporte.comportamiento ? 'Adecuado' : 'Inadecuado'}</li>
        <li><strong>Observaciones:</strong> ${reporte.observaciones}</li>
        <li><strong>Recomendaciones:</strong> ${reporte.recomendaciones}</li>
      </ul>
      <p>Saludos,</p>
      <p>GUIDO</p>
      <p><em>Tutor: ${profesor.nombre} ${profesor.apellido}</em></p>
    `;

    sendEmail(apoderado.email, 'Nuevo Reporte Generado', emailText);

    res.status(201).json(reporte);
  } catch (error) {
    console.error('Error al crear el reporte:', error); // Log del error ocurrido
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
      res.status(404).json({ message: 'Reporte no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const [updated] = await Reporte.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedReporte = await Reporte.findByPk(req.params.id);
      res.status(200).json(updatedReporte);
    } else {
      res.status(404).json({ message: 'Reporte no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const deleted = await Reporte.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Reporte no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
