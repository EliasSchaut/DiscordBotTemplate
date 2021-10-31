// ----------------------------------
// config values
// ----------------------------------
const name = "cooldown_global"
const type = "number"
const required = false
const cooldown_global = new Set()
const cooldown_base = 1000 // seconds
const timeouts = new Map()
const ms = require("ms")
// ----------------------------------
const error_key = "error.cooldown"
const help_key = "mods_help." + name
// ----------------------------------


// ----------------------------------
// check msg
// ----------------------------------
async function check(msg, command, args) {
    const mod = await get(msg, command)
    if (!mod) {
        return true

    } else if (check_cooldown_global(command, msg.author.id)) {
        return false

    } else {
        set_global_cooldown(command, msg.author.id, mod)
        return true
    }
}

async function send_check_fail(msg, command, args) {
    const err = await msg.client.lang_helper.get_text(msg, error_key, get_time_remaining(msg.author.id))
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
    return value ? await msg.client.lang_helper.get_text(msg, help_key, ms(value * cooldown_base)) : ""
}

function is_in(command) {
    return command.hasOwnProperty(name)
}
// ----------------------------------


// ----------------------------
// Private
// ----------------------------
function set_global_cooldown(command, user_id, cooldown_time) {
    cooldown_global.add(user_id)
    set_global_timeout(command, user_id, cooldown_time)
}

function check_cooldown_global(client, user_id) {
    return cooldown_global.has(user_id)
}

function get_time_remaining(user_id) {
    const timeout = timeouts.get(user_id)

    if (timeout) {
        return ms((timeout.createdTimestamp + timeout["_idleTimeout"]) - Date.now())

    } else {
        return "0s"
    }
}
// ----------------------------


// ----------------------------
// Timeout
// ----------------------------
function set_global_timeout(command, user_id, cooldown_time) {
    if (cooldown_time) {
        const timeout = setTimeout(() => {
            cooldown_global.delete(user_id);
        }, cooldown_time * cooldown_base)

        timeout.createdTimestamp = Date.now()
        timeouts.set(user_id, timeout)
    }
}
// ----------------------------

module.exports = { check, send_check_fail, is_valid, get, get_help, is_in, name, type, required }
