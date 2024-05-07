const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MeetingRoom = sequelize.define('MeetingRoom', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  htmlLink: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'html_link',
  },
  startDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date_time',
  },
  endDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date_time',
  },
  creatorEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'creator_email',
  },
  organizerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'organizer_email',
  },
  iCalUID: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'i_cal_uid',
  },
  remindersUseDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'reminders_use_default',
  },
  idProfesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_profesor',
  },
}, { timestamps: false });

module.exports = MeetingRoom;
