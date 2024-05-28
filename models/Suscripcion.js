const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Suscripcion = sequelize.define('Suscripcion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo_suscripcion: {
    type: DataTypes.ENUM('Mensual', 'Trimestral', 'Anual'),
    allowNull: false,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, 
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Suscripciones',
  timestamps: true,
});

module.exports = Suscripcion;
