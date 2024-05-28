// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Suscripcion = sequelize.define('Suscripcion', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   tipo_suscripcion: {
//     type: DataTypes.ENUM('Mensual', 'Trimestral', 'Anual'),
//     allowNull: false,
//   },
//   fecha_inicio: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   fecha_fin: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
// }, {
//   tableName: 'Suscripciones',
//   timestamps: true,
// });

// module.exports = Suscripcion;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Suscripcion = sequelize.define(
  "Suscripcion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipo_suscripcion: {
      type: DataTypes.ENUM("Mensual", "Trimestral", "Anual"),
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
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    payment_currency: {
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
  },
  {
    timestamps: true,
    tableName: "Suscripciones",
  }
);

module.exports = Suscripcion;
