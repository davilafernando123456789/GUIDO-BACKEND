// models/horario.js
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const Educativos = sequelize.define(
  "Antecedentes_educativos",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    institucion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pais_institucion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_obtencion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nivel_educacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: true,
    tableName: "Antecedentes_educativos",
  }
);

module.exports = Educativos;
