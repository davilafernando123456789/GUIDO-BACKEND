const Reuniones = require('../models/Reuniones');
const sequelize = require('../config/db');

exports.createReunion = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_clase, fecha, duracion, enlace } = req.body;

    // Crear la reunión
    const newReunion = await Reuniones.create({
      id_clase,
      fecha,
      duracion,
      enlace
    }, { transaction: t });

    // Commit la transacción
    await t.commit();

    res.status(201).json(newReunion);
  } catch (error) {
    // Rollback si hay un error
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al crear la reunión' });
  }
};

exports.getReunionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la reunión por su ID en la base de datos
    const reunion = await Reuniones.findByPk(id);

    if (!reunion) {
      res.status(404).json({ message: 'Reunión no encontrada' });
      return;
    }

    res.json(reunion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al obtener la reunión' });
  }
};
