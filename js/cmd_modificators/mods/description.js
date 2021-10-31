// ----------------------------------
// config values
// ----------------------------------
const name = "description"
const type = "function"
const required = true
// ----------------------------------
const error_key = "error." + name
const help_key = "mods_help." + name
// ----------------------------------


// ----------------------------------
// check msg
// ----------------------------------
async function check(msg, command, args) {
    return true
}

async function send_check_fail(msg, command, args) {
    return true
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
    return (is_in(command)) ? await command[name](msg) : false
}

async function get_help(msg, command) {
    return ""
}

function is_in(command) {
    return command.hasOwnProperty(name)
}
// ----------------------------------

module.exports = { check, send_check_fail, is_valid, get, get_help, is_in, name, type, required }
