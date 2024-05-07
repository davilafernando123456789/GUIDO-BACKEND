// models/Alumnos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Apoderado = require('./Apoderado');
const Inscripcion = require('./Inscripciones');
const Alumno = sequelize.define('Alumno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha_nac: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Roles_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Apoderado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Puedes ajustar el valor predeterminado según tus necesidades
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: true });

Alumno.belongsTo(Apoderado, { foreignKey: 'Apoderado_id', as: 'apoderado' });


module.exports = Alumno;