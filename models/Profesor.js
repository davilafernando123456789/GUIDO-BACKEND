// models/Profesores.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const Educativos = require('./AntecedentesEducativo');
const Suscripcion = require('./Suscripcion');

const Profesores = sequelize.define('Profesores', {
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
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha_nac: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  especialidad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sala: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  Antecedentes_educativos_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Direccion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Roles_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Suscripcion_id: {
    type: DataTypes.INTEGER,
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
}, {
  timestamps: true, 
});

Profesores.belongsTo(Educativos, { foreignKey: 'id', as: 'Educativos' });
// Profesores.hasMany(MeetingRoom, { foreignKey: 'idProfesor' });
Profesores.belongsTo(Suscripcion, { foreignKey: 'Suscripcion_id', as: 'suscripcion' }); 
module.exports = Profesores;
