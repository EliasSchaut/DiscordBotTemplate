// ===============================
// This file provides different useful methods about handling with the database
// ===============================

const { DB } = require("./db_init")
const { default_lang } = require("../config/config.json")
const { logger } = require("../js/logger")
const { get_text : gt } = require("../lang/lang_helper")
const User_Lang = DB.User_Lang
const s = "commands.lang."

// add the author from message in the database 'User_Lang'. Also set lang to config.default_lang
async function add_user_lang(message) {
    logger.log("info", `try to add user ${message.author.username} to database 'User_Lang' (id: ${message.author.id})`)

    try {
        await User_Lang.create({
            user_id: message.author.id,
            lang: default_lang
        })
        logger.log("info",`user ${message.author.username} successfully added to database 'User_Lang' (id: ${message.author.id})`);

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            logger.log("warn",`user ${message.author.username} already exist in database 'User_Lang' (id: ${message.author.id})`);

        } else {
            logger.log("error",`Something went wrong with adding user ${message.author.username} in database 'User_Lang' (id: ${message.author.id})`);
        }
    }
}

// get lang of the author from message. If author doesn't exist in database, the author will added into it
async function get_lang(message) {
    const tag = await User_Lang.findOne({ where: { user_id: message.author.id } });

    if (tag) {
        return tag.lang

    } else {
        logger.log("warn",`user ${message.author.username} not in database 'User_Lang' (id: ${message.author.id})'`)
        await add_user_lang(message)
        return await get_lang(message)
    }
}

// set lang of the author from message
async function set_lang(message, to_set) {
    const old_lang = await get_lang(message)
    const new_tag = await User_Lang.update({ lang: to_set }, { where: { user_id: message.author.id } });

    if (new_tag) {
        return message.channel.send(`${await gt(message, `${s}set`)} ${old_lang} -> ${to_set}`);

    } else {
        logger.log("error", `Could not get lang of user ${message.author.username} in database 'User_Lang' (id: ${message.author.id})`)
        return message.reply(`${await gt(message, `${s}error`)} (${message.author.username})!`);
    }
}

module.exports = { add_user: add_user_lang, get_lang, set_lang }
