// ----------------------------------
// config values
// ----------------------------------
const name = "need_permission"
const type = "object"
const required = true
// ----------------------------------
const lang_key = "error." + name
// ----------------------------------


// ----------------------------------
// check msg
// ----------------------------------
async function check(msg, command, args) {
    const mod = await get(msg, command)
    return !mod || !mod.length || msg.client.helper.has_permission(msg, mod)
}

async function send_check_fail(msg, command, args) {
    const err = await msg.client.lang_helper.get_text(msg, lang_key, await get(msg, command))
    msg.client.output.reply(msg, err)
}
// ----------------------------------


// ----------------------------------
// check/get modification
// ----------------------------------
function is_valid(command) {
    const is_in = is_in(command)
    return (is_in || !required) && (!is_in || (typeof command[name] === type))
}

async function get(msg, command) {
    return (is_in(command)) ? command[name] : false
}

function is_in(command) {
    return command.hasOwnProperty(name)
}
// ----------------------------------

module.exports = { check, send_check_fail, is_valid, get, is_in, name, type, required }
