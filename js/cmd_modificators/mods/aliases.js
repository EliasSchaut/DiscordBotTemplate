// ----------------------------------
// config values
// ----------------------------------
const name = "aliases"
const type = "object"
const required = false
// ----------------------------------
const lang_key = "error." + name
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
