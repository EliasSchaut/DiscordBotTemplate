// get the entire database
// See also: https://discordjs.guide/sequelize and https://discordjs.guide/sequelize/currency.html

const Sequelize = require('sequelize');
const fs = require("fs")
const path = require("path")

// create sequelize
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

// get models and save it into DB.<tags_name>
const DB = {}
const normalized_path = path.join(__dirname, "models")
fs.readdirSync(normalized_path).forEach(function (file_path) {
    const file = require("./models/" + file_path)
    DB[file.name] = file(sequelize, Sequelize.DataTypes)
})

// add foreign keys. Example:
// DB.example.belongsTo(DB.anotherExmaple, { foreignKey: 'id', as: 'ID' });

// add optional methods. Example:
// DB.example.prototype.function_name(param1) {}


// also add created functions
module.exports = { DB }