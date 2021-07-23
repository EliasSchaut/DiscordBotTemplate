// require sequelize for database
const Sequelize = require('sequelize');

// create sequelize
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

// create database model
const Tags = sequelize.define('tags', {
    guild_id: {
        type: Sequelize.STRING,
        unique: true,
    },
    value1: Sequelize.TEXT,
    value2: Sequelize.TEXT,
});

module.exports = { Tags }