const Administrador = require("../models/Administrador");

// Obtener todos los administradores
const getAllAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.findAll();
    res.json(administradores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los administradores." });
  }
};

// Obtener un administrador por ID
const getAdministradorById = async (req, res) => {
  const { id } = req.params;
  try {
    const administrador = await Administrador.findByPk(id);
    if (administrador) {
      res.json(administrador);
    } else {
      res.status(404).json({ error: "Administrador no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el administrador." });
  }
};

module.exports = {
  getAllAdministradores,
  getAdministradorById
};
