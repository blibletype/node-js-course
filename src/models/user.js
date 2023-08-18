const { DataTypes } = require('sequelize')
const sequelize = require('../utils/database')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  username: {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

module.exports = User
