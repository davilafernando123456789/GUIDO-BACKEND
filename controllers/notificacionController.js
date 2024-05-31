const Notificacion = require('../models/Notificacion');

exports.crearNotificacion = async (req, res) => {
  try {
    const { usuario_id, rol_id, tipo, descripcion } = req.body;
    console.log('Datos recibidos para crear notificación:', { usuario_id, rol_id, tipo, descripcion });
    const notificacion = await Notificacion.create({ usuario_id, rol_id, tipo, descripcion });
    console.log('Notificación creada exitosamente:', notificacion);
    res.status(201).json(notificacion);
  } catch (error) {
    console.error('Error al crear la notificación:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerNotificaciones = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    console.log('Obteniendo notificaciones para usuario_id:', usuario_id);
    const notificaciones = await Notificacion.findAll({
      where: { usuario_id }
    });
    console.log('Notificaciones obtenidas:', notificaciones);
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.marcarComoLeido = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Marcando como leído la notificación con id:', id);
    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      console.error('Notificación no encontrada:', id);
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    notificacion.leido = true;
    await notificacion.save();
    console.log('Notificación marcada como leída:', notificacion);
    res.status(200).json(notificacion);
  } catch (error) {
    console.error('Error al marcar la notificación como leída:', error);
    res.status(400).json({ error: error.message });
  }
};
