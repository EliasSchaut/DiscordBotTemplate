// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
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
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
// add the author from message in the database 'User_Lang'. Also set lang to config.default_lang
async function add(msg) {
    msg.client.logger.log("info", `try to add user ${msg.author.username} to database 'User_Lang' (id: ${msg.author.id})`)

    try {
        await msg.client.DB.User_Lang.TABLE.create({
            user_id: msg.author.id,
            lang: msg.client.config.default_lang
        })
        msg.client.logger.log("info",`user ${msg.author.username} successfully added to database 'User_Lang' (id: ${msg.author.id})`)

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            msg.client.logger.log("warn",`user ${msg.author.username} already exist in database 'User_Lang' (id: ${msg.author.id})`)

        } else {
            msg.client.logger.log("error",`Something went wrong with adding user ${msg.author.username} in database 'User_Lang' (id: ${msg.author.id})`)
        }
    }
}


// get lang of the author from message. If author doesn't exist in database, the author will added into it
async function get(msg) {
    const tag = await msg.client.DB.User_Lang.TABLE.findOne({ where: { user_id: msg.author.id } })

    if (tag) {
        return tag.lang

    } else {
        msg.client.logger.log("warn",`user ${msg.author.username} not in database 'User_Lang' (id: ${msg.author.id})'`)
        await add(msg)
        return await get(msg)
    }
}


// set lang of the author from message
async function set(msg, new_lang) {
    const old_lang = await get(msg)
    const new_tag = await msg.client.DB.User_Lang.TABLE.update({ lang: new_lang }, { where: { user_id: msg.author.id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("error", `Could not set lang from ${old_lang} to ${new_lang} of user ${msg.author.username} in database 'User_Lang' (id: ${msg.author.id})`)
        return false
    }
}

async function remove(msg, guild_id) {

}
// ---------------------------------------------


module.exports = { _TABLE, add, get, set, remove }
