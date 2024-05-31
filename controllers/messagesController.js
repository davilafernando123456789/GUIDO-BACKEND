const Mensaje = require('../models/Messages');

let clients = [];

exports.setClients = (client) => {
  clients.push(client);
};

exports.crearMensaje = async (req, res) => {
  try {
    const { contenido, remite_id, destinatario_id } = req.body;
    const mensaje = await Mensaje.create({ contenido, remite_id, destinatario_id });

    // Emitir el nuevo mensaje a todos los clientes conectados a través de WebSocket
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(mensaje));
      }
    });

    res.status(201).json(mensaje);
  } catch (error) {
    console.error('Error al crear el mensaje:', error);
    res.status(500).json({ error: 'No se pudo crear el mensaje.' });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const messages = await Mensaje.findAll();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las inscripciones' });
  }
};


exports.getMensajesPorDestinatario = async (req, res) => {
  try {
    const { destinatario_id } = req.params; // Se asume que el destinatario_id está en los parámetros de la solicitud
    const mensajes = await Mensaje.findAll({ where: { destinatario_id } });
    res.status(200).json(mensajes);
  } catch (error) {
    console.error('Error al obtener los mensajes por destinatario:', error);
    res.status(500).json({ error: 'No se pudieron obtener los mensajes.' });
  }
};

exports.deleteMensajeById = async (req, res) => {
  const { messageId } = req.params;

  try {
    // Buscar el mensaje por su ID
    const mensaje = await Mensaje.findByPk(messageId);
    if (!mensaje) {
      return res.status(404).json({ error: "Mensaje no encontrado." });
    }

    // Eliminar el mensaje
    await Mensaje.destroy({
      where: {
        id: messageId
      }
    });

    res.json({ message: "Mensaje eliminado correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el mensaje." });
  }
};
exports.updateMensajeById = async (req, res) => {
  const { messageId } = req.params;
  const { contenido, remite_id, destinatario_id } = req.body;

  try {
    // Buscar el mensaje por su ID
    const mensaje = await Mensaje.findByPk(messageId);
    if (!mensaje) {
      return res.status(404).json({ error: "Mensaje no encontrado." });
    }

    // Actualizar los campos del mensaje
    await mensaje.update({ contenido, remite_id, destinatario_id });

    res.json({ message: "Mensaje actualizado correctamente." });
  } catch (error) {
    console.error('Error al actualizar el mensaje:', error);
    res.status(500).json({ error: "Error al actualizar el mensaje." });
  }
};

exports.getMensajesPorRemitente = async (req, res) => {
  try {
    const { remite_id } = req.params;
    const mensajes = await Mensaje.findAll({ where: { remite_id } });
    res.status(200).json(mensajes);
  } catch (error) {
    console.error('Error al obtener los mensajes por remitente:', error);
    res.status(500).json({ error: 'No se pudieron obtener los mensajes.' });
  }
};
