const config = require("../config/config.json")


let command_tree = []

// Checks, if given message is from guild (a discord server)
function from_guild(message) {
    return message.channel.type === 'dm'
}

// Checks, if given message is from dm (personal chat with bot)
function from_dm(message) {
    return message.channel.type !== 'dm'
}

// Checks structural correctness of given args
function check_args(command, args) {
    return !command.hasOwnProperty("args_min_length") || args.length >= command.args_min_length
}

// Check, if a given user is an admin
function is_admin(user_id) {
    return config.user_ids_admin.includes(user_id) || user_id.roles.cache.some(role => role in config.role_ids_admin)
}

// print all executable commands for a given user in a human readable string
function permitted_commands_to_string(command_tree, user_id) {
    let out = ""
    Object.keys(command_tree).forEach(function (command_dir) {
        let data = []

        Object.keys(command_tree[command_dir]).forEach(function (command) {
            if (!((command_tree[command_dir][command].restricted && !is_admin(user_id)))) {
                data.push(command)
            }
        })

        if (data) {
            out += `\n**${command_dir.toUpperCase()}**\n${data.join("\n")}\n`
        }
    })

    return out
}

module.exports = { command_tree, from_guild, from_dm, check_args , is_permitted: is_admin, permitted_commands_to_string}