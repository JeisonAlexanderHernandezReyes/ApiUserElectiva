const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbconfig/database');

const User = sequelize.define('User', {
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  DocumentNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  DocumentType: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = User;
