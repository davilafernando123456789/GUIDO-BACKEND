const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reporte = sequelize.define('Reporte', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Profesor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Alumno_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Apoderado_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  asistencia: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  participacion: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  comprension: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  comportamiento: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recomendaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'Reportes'
});

module.exports = Reporte;
