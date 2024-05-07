// // models/horario.js
// const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = require('../config/db');

// const Penales = sequelize.define('Antecedentes_penales', {
//   fecha_registro: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   descripcion: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   resolucion: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
//   },
// }, {
//   timestamps: true,
//   tableName: 'Antecedentes_penales', 
// });

// module.exports = Penales;
