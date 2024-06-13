// models/Recomendaciones.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Alumno = require('./Alumno'); 


const Recomendaciones = sequelize.define('Recomendaciones', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  estrellas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comentario: {
    type: DataTypes.TEXT
  },
  Alumnos_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Profesores_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'Recomendaciones'
});
Recomendaciones.belongsTo(Alumno, { foreignKey: 'Alumnos_id' });
module.exports = Recomendaciones;

// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/db'); // Asegúrate de que esta ruta es correcta según tu estructura de archivos

// class Recomendaciones extends Model {}

// Recomendaciones.init({
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   estrellas: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   comentario: {
//     type: DataTypes.TEXT,
//   },
//   Alumnos_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   Profesores_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// }, {
//   sequelize,
//   modelName: 'Recomendaciones',
// });

// module.exports = Recomendaciones;
