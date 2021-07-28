module.exports = (sequelize, Sequelize) => {
    return sequelize.define('User_Lang', {
        user_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        lang: Sequelize.STRING,
    }, {
        timestamp: false
    })
}
