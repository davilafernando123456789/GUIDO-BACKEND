const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Direccion = sequelize.define('Direccion', {
  calle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  distrito: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codigo_postal: {
    type: DataTypes.STRING,
    allowNull: true,
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
},  {
  tableName: 'direccion', // Nombre de la tabla en la base de datos
  timestamps: true
});

module.exports = Direccion;
