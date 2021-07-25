// With this file you can set up or recreate the entire database
// See also: https://discordjs.guide/sequelize and https://discordjs.guide/sequelize/currency.html

const Sequelize = require('sequelize')
const fs = require("fs")
const path = require("path")

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
})

// get models and save it into DB.<tags_name>
const DB = {}
const normalized_path = path.join(__dirname, "models")
fs.readdirSync(normalized_path).forEach(function (file_path) {
    const file = require("./models/" + file_path)
    DB[file.name] = file(sequelize, Sequelize.DataTypes)
})

// clear database, if run 'node dbInit.js --force' or 'node dbInit.js -f'
const force = process.argv.includes('--force') || process.argv.includes('-f')

// set up database
sequelize.sync({ force }).then(async () => {
    const DB = [
        // set optional start values. Example:
        // DB.example.upsert({ guild: "123456789", value1: "hello_world" })
    ];
    await Promise.all(DB)
    console.log('Database synced')
    sequelize.close()
}).catch(console.error)