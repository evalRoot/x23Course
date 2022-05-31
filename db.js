const {Sequelize} = require('sequelize')
const DB_NAME = 'postgres'
const DB_USER = 'postgres'
const DB_PASSWORD = '1234'
const DB_HOST = '127.0.0.1'
const DB_PORT = '5436'

module.exports = new Sequelize(
  DB_NAME, // Название БД
  DB_USER, // Пользователь
  DB_PASSWORD, // ПАРОЛЬ
  {
    dialect: 'postgres',
    host: DB_HOST,
    port: DB_PORT
  }
)
