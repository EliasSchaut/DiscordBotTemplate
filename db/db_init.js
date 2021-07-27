// With this file you can set up or recreate the entire database
// See also: https://discordjs.guide/sequelize and https://discordjs.guide/sequelize/currency.html

const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
})

const User_Lang = require("./models/User_Lang.js")(sequelize, Sequelize)

module.exports = { User_Lang }
