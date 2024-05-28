const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de que esta ruta es correcta según tu estructura de archivos

class Recomendaciones extends Model {}

Recomendaciones.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  estrellas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comentario: {
    type: DataTypes.TEXT,
  },
  Alumnos_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Profesores_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Recomendaciones',
});

module.exports = Recomendaciones;
