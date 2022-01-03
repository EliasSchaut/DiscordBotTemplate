// ----------------------------------
// config values
// ----------------------------------
const name = "args_min_length"
const type = "number"
const required = false
// ----------------------------------
const error_key = "error." + name
const help_key = "mods_help." + name
// ----------------------------------


// ----------------------------------
// check msg
// ----------------------------------
async function check(msg, command, args) {
    const mod = await get(msg, command)
    return !mod || (args.length >= mod)
}

async function send_check_fail(msg, command, args) {
    let err = await msg.client.lang_helper.get_text(msg, error_key, await get(msg, command), args.length)

    const cmd_usage = await msg.client.mods.usage.get(msg, command)
    const prefix = msg.client.config.enable_prefix_change ? await msg.client.DB.Guild.get_prefix(msg) : msg.client.config.prefix
    if (cmd_usage) {
        err += "\n" + await msg.client.lang_helper.get_text(msg, "error.missing_args_proper_use", `${prefix}${command.name} ${cmd_usage}`)
    }

    msg.client.output.reply(msg, err)
}
// ----------------------------------


// ----------------------------------
// check/get modification
// ----------------------------------
function is_valid(command) {
    const is_in_command = is_in(command)
    return (is_in_command || !required) && (!is_in_command || (typeof command[name] === type))
}

async function get(msg, command) {
    return (is_in(command)) ? command[name] : false
}

async function get_help(msg, command) {
    const value = await get(msg, command)
    return value ? await msg.client.lang_helper.get_text(msg, help_key, value) : ""
}

function is_in(command) {
    return command.hasOwnProperty(name)
}
// ----------------------------------

module.exports = { check, send_check_fail, is_valid, get, get_help, is_in, name, type, required }
