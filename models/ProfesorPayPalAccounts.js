const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProfesorPayPalAccount = sequelize.define('ProfesorPayPalAccount', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  profesor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paypal_email: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'ProfesorPayPalAccounts'
});

module.exports = ProfesorPayPalAccount;
