// ===============================
// This file provides different useful methods about handling with the database
// ===============================

const { DB } = require("./db_init")
const { default_lang, prefix } = require("../config/config.json")
const { logger } = require("../js/logger")
const Guild = DB.Guild
const User_Lang = DB.User_Lang

// -----------------------------------
// Guild
// -----------------------------------
// add the guild from message in the database 'Guild'. Also set prefix to config.prefix
async function create_guild_tag(message) {
    logger.log("info", `try to add guild ${message.member.guild.name} to database 'Guild'`)

    try {
        await Guild.create({
            guild_id: message.member.guild.id,
            prefix: prefix
        })
        logger.log("info",`guild ${message.member.guild.name} successfully added to database 'Guild'`)

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            logger.log("warn",`guild ${message.member.guild.name} already exist in database 'Guild'`)

        } else {
            logger.log("error",`Something went wrong with adding guild ${message.member.guild.name} in database 'Guild'`)
        }
    }
}

// get prefix of the guild from message. If guild doesn't exist in database, the guild will added into it
async function get_prefix(message) {
    if (message.client.helper.from_dm(message)) {
        return message.client.config.prefix
    }

    const tag = await Guild.findOne({ where: { guild_id: message.member.guild.id } })

    if (tag) {
        return tag.prefix

    } else {
        logger.log("warn",`guild ${message.member.guild.name} not in database 'Guild'`)
        await create_guild_tag(message)
        return await get_prefix(message)
    }
}

// set prefix of the author from message
async function set_prefix(message, new_prefix) {
    const old_prefix = await get_prefix(message)
    const new_tag = await Guild.update({ prefix: new_prefix }, { where: { guild_id: message.member.guild.id } })

    if (new_tag) {
        return true

    } else {
        logger.log("error", `Could not set prefix from ${old_prefix} to ${new_prefix} of guild ${message.member.guild.name} in database 'Guild'`)
        return false
    }
}
// -----------------------------------



// -----------------------------------
// User_Lang
// -----------------------------------
// add the author from message in the database 'User_Lang'. Also set lang to config.default_lang
async function add_user_lang(message) {
    logger.log("info", `try to add user ${message.author.username} to database 'User_Lang' (id: ${message.author.id})`)

    try {
        await User_Lang.create({
            user_id: message.author.id,
            lang: default_lang
        })
        logger.log("info",`user ${message.author.username} successfully added to database 'User_Lang' (id: ${message.author.id})`)

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            logger.log("warn",`user ${message.author.username} already exist in database 'User_Lang' (id: ${message.author.id})`)

        } else {
            logger.log("error",`Something went wrong with adding user ${message.author.username} in database 'User_Lang' (id: ${message.author.id})`)
        }
    }
}

// get lang of the author from message. If author doesn't exist in database, the author will added into it
async function get_lang(message) {
    const tag = await User_Lang.findOne({ where: { user_id: message.author.id } })

    if (tag) {
        return tag.lang

    } else {
        logger.log("warn",`user ${message.author.username} not in database 'User_Lang' (id: ${message.author.id})'`)
        await add_user_lang(message)
        return await get_lang(message)
    }
}

// set lang of the author from message
async function set_lang(message, new_lang) {
    const old_lang = await get_lang(message)
    const new_tag = await User_Lang.update({ lang: new_lang }, { where: { user_id: message.author.id } })

    if (new_tag) {
        return true

    } else {
        logger.log("error", `Could not set lang from ${old_lang} to ${new_lang} of user ${message.author.username} in database 'User_Lang' (id: ${message.author.id})`)
        return false
    }
}
// -----------------------------------

module.exports = { add_user: add_user_lang, get_lang, set_lang, get_prefix, set_prefix }
