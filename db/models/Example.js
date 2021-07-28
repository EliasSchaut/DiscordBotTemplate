// ===============================
// Example database model
// See also: https://discordjs.guide/sequelize
// ===============================

module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Example', {
        guild_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        value1: Sequelize.TEXT,
        value2: Sequelize.TEXT,
    }, {
        timestamp: false
    })
}
