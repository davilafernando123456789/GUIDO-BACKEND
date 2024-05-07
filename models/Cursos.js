// models/horario.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Cursos = sequelize.define('Cursos', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  timestamps: true,
  tableName: 'cursos', 
});

module.exports = Cursos;
