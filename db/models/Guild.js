module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Guild', {
        guild_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        prefix: Sequelize.TEXT,
    }, {
        timestamp: false
    })
}
