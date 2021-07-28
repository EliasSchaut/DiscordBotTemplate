// ===============================
// This file creates the database from the models in ./models
// See also: https://discordjs.guide/sequelize
// ===============================

const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
})

const User_Lang = require("./models/User_Lang.js")(sequelize, Sequelize)

module.exports = { User_Lang }
