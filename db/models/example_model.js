// example database model
// See also: https://discordjs.guide/sequelize and https://discordjs.guide/sequelize/currency.html

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('example', {
        guild_id: {
            type: DataTypes.STRING,
            unique: true,
        },
        value1: DataTypes.TEXT,
        value2: DataTypes.TEXT,
    }, {
        timestamp: false
    })
}