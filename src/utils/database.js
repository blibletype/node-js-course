const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('node-course', 'root', '1', {
  dialect: 'mariadb',
  host: 'localhost',
})

module.exports = sequelize
