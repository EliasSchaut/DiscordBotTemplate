// event_handler fields
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

    if (await msg.client.mod_man.check_all_mods(msg, command, args)) {
        await try_to_execute(msg, command, args)
    }
}
// ---------------------------------

// ----------------------------------
// Getter
// ----------------------------------
async function get_prefix(msg) {
    return msg.client.config.enable_prefix_change ? await msg.client.DB.Guild.get_prefix(msg) : msg.client.config.prefix
}

function get_command_name_and_args(msg, prefix) {
    const content = msg.content.slice(prefix.length).trim()

    const args = content.match(/"[^"]+"|[^\s]+/g)
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('"')) args[i] = args[i].slice(1)
        if (args[i].endsWith('"')) args[i] = args[i].slice(0, args[i].length - 1)
    }
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
function check_prefix(msg, prefix) {
    return msg.content.startsWith(prefix)
}

function check_bot(msg) {
    return msg.author.bot
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
        msg.client.output.reply(msg, await msg.client.lang_helper.get_text(msg, `${s}error`))
    }
}
// ----------------------------------

module.exports = { message_create, check_bot, try_to_execute}
