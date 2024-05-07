// controllers/apoderadoController.js
const Apoderado = require('../models/Apoderado');

// Obtener todos los apoderados
exports.getAllApoderados = async (req, res) => {
  try {
    const apoderados = await Apoderado.findAll();
    res.json(apoderados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener apoderados' });
  }
};

// Obtener un apoderado por ID
exports.getApoderadoById = async (req, res) => {
  const apoderadoId = req.params.id;

  try {
    const apoderado = await Apoderado.findByPk(apoderadoId);
    if (apoderado) {
      res.json(apoderado);
    } else {
      res.status(404).json({ error: 'Apoderado no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener apoderado' });
  }
};

// Crear un nuevo apoderado
exports.createApoderado = async (req, res) => {
  try {
    const nuevoApoderado = await Apoderado.create(req.body);
    res.status(201).json(nuevoApoderado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear apoderado' });
  }
};

// Actualizar un apoderado por ID
exports.updateApoderadoById = async (req, res) => {
  const apoderadoId = req.params.id;

  try {
    const [updatedRows] = await Apoderado.update(req.body, {
      where: { id: apoderadoId },
    });

    if (updatedRows > 0) {
      res.json({ message: 'Apoderado actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Apoderado no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar apoderado' });
  }
};

// Eliminar un apoderado por ID
exports.deleteApoderadoById = async (req, res) => {
  const apoderadoId = req.params.id;

  try {
    const deletedRowCount = await Apoderado.destroy({
      where: { id: apoderadoId },
    });

    if (deletedRowCount > 0) {
      res.json({ message: 'Apoderado eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Apoderado no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar apoderado' });
  }
};
