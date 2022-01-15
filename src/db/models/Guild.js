// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
    return sequelize.define('Guild', {
        guild_id: {
            type: Sequelize.STRING,
            unique: true,
        },
        prefix: Sequelize.TEXT
    }, {
        timestamp: false
    })
}
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
// -------------
// General
// -------------
// get all guild_ids
async function get_guild_ids(client) {
    const tag = await client.DB.Guild.TABLE.findAll({attributes: ["guild_id"]})
    return (tag) ? tag.map(function (e) {
        return e.dataValues.guild_id
    }) : []
}


// add the guild from message in the database 'Guild'. Also set prefix to config.prefix
async function add(client, guild_id) {
    client.logger.log("info", `try to add guild ${guild_id} to database 'Guild'`)

    try {
        await client.DB.Guild.TABLE.create({
            guild_id: guild_id,
            prefix: client.config.prefix
        })
        client.logger.log("info",`guild ${guild_id} successfully added to database 'Guild'`)

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            client.logger.log("warn",`guild ${guild_id} already exist in database 'Guild'`)

        } else {
            client.logger.log("error",`Something went wrong with adding guild ${guild_id} in database 'Guild'`)
        }
    }
}

async function remove(client, guild_id) {

}
// -------------


// -------------
// Prefix
// -------------
// get prefix of the guild from message. If guild doesn't exist in database, the guild will added into it
async function get_prefix(msg) {
    if (msg.client.helper.from_dm(msg)) {
        return msg.client.config.prefix
    }

    const tag = await msg.client.DB.Guild.TABLE.findOne({ where: { guild_id: msg.member.guild.id } })

    if (tag) {
        return tag.prefix

    } else {
        msg.client.logger.log("warn",`guild ${msg.member.guild.name} not in database 'Guild'`)
        await add(msg.client, msg.member.guild.id)
        return await get_prefix(msg)
    }
}

// set prefix of the author from message
async function set_prefix(msg, new_prefix) {
    const old_prefix = await get_prefix(msg)
    const new_tag = await msg.client.DB.Guild.TABLE.update({ prefix: new_prefix }, { where: { guild_id: msg.member.guild.id } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("error", `Could not set prefix from ${old_prefix} to ${new_prefix} of guild ${msg.member.guild.name} in database 'Guild'`)
        return false
    }
}
// -------------
// ---------------------------------------------


module.exports = { _TABLE, add, get_guild_ids, get_prefix, set_prefix }
