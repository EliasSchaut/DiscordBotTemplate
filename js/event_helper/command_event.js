// event_helper fields
const s = "command_create."

// ---------------------------------
// Export
// ---------------------------------
async function message_create(msg) {
    if (check_bot(msg)) return

    const prefix = await get_prefix(msg)
    if (!check_prefix(msg, prefix)) return

    const [command_name, args] = get_command_name_and_args(msg, prefix)
    const command = get_command(msg, command_name)
    if (!command) return

    if (await check_message(msg, prefix, command, args)) {
        await try_to_execute(msg, command, args)
    }
}
// ---------------------------------

// ----------------------------------
// Getter
// ----------------------------------
async function get_prefix(msg) {
    return msg.client.config.enable_prefix_change ? await msg.client.db_helper.get_prefix(msg) : msg.client.config.prefix
}

function get_command_name_and_args(msg, prefix) {
    const args = msg.content.slice(prefix.length).trim().split(/ +/)
    const command_name = args.shift().toLowerCase()
    return [command_name, args]
}

function get_command(msg, command_name) {
    return msg.client.commands.get(command_name)
        || msg.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name))
}
// ----------------------------------


// ----------------------------------
// Checker
// ----------------------------------
async function check_message(msg, prefix, command, args) {
    if (!check_admin_only(msg, command)) await send_fail_admin_only(msg)
    else if (!check_permissions(msg, command)) await send_fail_permissions(msg)
    else if (!check_guild_only(msg, command)) await send_fail_guild_only(msg)
    else if (!check_dm_only(msg, command)) await send_fail_dm_only(msg)
    else if (!check_nsfw(msg, command)) await send_fail_nsfw(msg)
    else if (!check_args(msg, command, args)) await send_fail_missing_args(msg, prefix, command)
    // add more command modification checker here
    else return true

    return false
}

function check_prefix(msg, prefix) {
    return msg.content.startsWith(prefix)
}

function check_bot(msg) {
    return msg.author.bot
}

function check_admin_only(msg, command) {
    return !(msg.client.mod_getter.get_admin_only(command)) || msg.client.helper.is_admin(msg)
}

function check_permissions(msg, command) {
    const need_permission = msg.client.mod_getter.get_need_permission(command)

    return !(need_permission.length)
        || msg.client.helper.has_permission(msg, need_permission)
}

function check_guild_only(msg, command) {
    return !(msg.client.mod_getter.get_guild_only(command)) || msg.client.helper.from_guild(msg)
}

function check_dm_only(msg, command) {
    return !(msg.client.mod_getter.get_dm_only(command)) || msg.client.helper.from_dm(msg)
}

function check_nsfw(msg, command) {
    return !(msg.client.mod_getter.get_nsfw(command)) || msg.client.helper.is_nsfw_channel(msg)
}

function check_args(msg, command, args) {
    return !(msg.client.mod_getter.get_args_needed(command)) || msg.client.helper.check_args(msg, command, args)
}
// ----------------------------------



// ----------------------------------
// Check-Fail-Messages
// ----------------------------------
async function send_fail_admin_only(msg) {
    return msg.reply(await msg.client.lang_helper.get_text(msg, `${s}restricted`))
}

async function send_fail_permissions(msg) {
    return msg.reply(await msg.client.lang_helper.get_text(msg, `${s}restricted`))
}

async function send_fail_guild_only(msg) {
    return msg.reply(await msg.client.lang_helper.get_text(msg, `${s}guild_only`))
}

async function send_fail_dm_only(msg) {
    return msg.reply(await msg.client.lang_helper.get_text(msg, `${s}dm_only`))
}

async function send_fail_nsfw(msg) {
    return msg.reply(await msg.client.lang_helper.get_text(msg, `${s}nsfw_only`))
}

async function send_fail_missing_args(msg, prefix, command) {
    let reply = `${await msg.client.lang_helper.get_text(msg, `${s}missing_args`)}, ${msg.author}`
    const usage = await msg.client.mod_getter.get_usage(msg, command)

    if (usage) {
        const name = msg.client.mod_getter.get_name(command)
        reply += `\n${(await msg.client.lang_helper.get_text(msg, `${s}missing_args_proper_use`))} \`${prefix}${name} ${usage}\``
    }

    return msg.channel.send(reply)
}
// ----------------------------------



// ----------------------------------
// Execute
// ----------------------------------
async function try_to_execute(msg, command, args) {
    try {
        await command.execute(msg, args)

    } catch (e) {
        msg.client.logger.log("error", e)
        msg.reply(await msg.client.lang_helper.get_text(msg, `${s}error`))
    }
}
// ----------------------------------

module.exports = { message_create, check_message, check_dm_only, check_guild_only, check_nsfw, check_args,
    check_admin_only, check_permissions, check_bot, try_to_execute}
