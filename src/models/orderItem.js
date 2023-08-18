const { DataTypes } = require('sequelize')
const sequelize = require('../utils/database')

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  quantity: DataTypes.INTEGER,
})

module.exports = OrderItem
