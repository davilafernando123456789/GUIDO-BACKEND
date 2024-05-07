
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Horario = sequelize.define('Horario', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dia_semana: {
    type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
    allowNull: true,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Profesores_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Horario;
