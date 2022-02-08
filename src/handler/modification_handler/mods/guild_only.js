// ----------------------------------
// config values
// ----------------------------------
const name = "guild_only"
const type = "boolean"
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
    return !mod || msg.client.helper.from_guild(msg)
}

async function send_check_fail(msg, command, args) {
    const err = await msg.client.lang_helper.get_text(msg, error_key)
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
    return await get(msg, command) ? await msg.client.lang_helper.get_text(msg, help_key) : ""
}

function is_in(command) {
    return command.hasOwnProperty(name)
}
// ----------------------------------

module.exports = { check, send_check_fail, is_valid, get, get_help, is_in, name, type, required }
