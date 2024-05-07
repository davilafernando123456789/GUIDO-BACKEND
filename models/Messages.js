const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mensaje = sequelize.define('Mensaje', {
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  remite_id: { // Ajustar el nombre de la columna
    type: DataTypes.INTEGER,
    allowNull: false
  },
  destinatario_id: { // Ajustar el nombre de la columna
    type: DataTypes.INTEGER,
    allowNull: false
  },
  archivo_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  audio_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sent: {
    type: DataTypes.BOOLEAN,
    allowNull: true, 
  }
});

module.exports = Mensaje;
