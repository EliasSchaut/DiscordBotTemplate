// ----------------------------------
// config values
// ----------------------------------
const name = "args_max_length"
const type = "number"
const required = false
// ----------------------------------
const lang_key = "error." + name
// ----------------------------------


// ----------------------------------
// check msg
// ----------------------------------
async function check(msg, command, args) {
    const mod = await get(msg, command)
    return !mod || (args.length > mod)
}

async function send_check_fail(msg, command, args) {
    let err = await msg.client.lang_helper.get_text(msg, lang_key, await get(msg, command), args.length)

    if (await msg.client.mods.usage.get(msg, command)) {
        err += "\n" + await msg.client.lang_helper.get_text(msg, "error.missing_args_proper_use")
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

function is_in(command) {
    return command.hasOwnProperty(name)
}
// ----------------------------------

module.exports = { check, send_check_fail, is_valid, get, is_in, name, type, required }
