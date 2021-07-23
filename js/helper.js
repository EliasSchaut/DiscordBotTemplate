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
function is_admin(user) {
    return config.user_ids_admin.includes(user.id) || user.roles.cache.some(role => role in config.role_ids_admin)
}

// Check, if a given user have all of the given permissions as list
function has_permission(user, permission_list) {
    return user.hasPermission(permission_list)
}

// print all executable commands for a given user in a human readable string
function permitted_commands_to_string(command_tree, user) {
    let out = ""
    Object.keys(command_tree).forEach(function (command_dir) {
        let data = []

        Object.keys(command_tree[command_dir]).forEach(function (command_name) {
            const command = command_tree[command_dir][command_name]

            // user is admin or permitted
            if (!((command.hasOwnProperty("admin_only") && command.admin_only && !is_admin(user))
                ||  (command.hasOwnProperty("need_permission") && !has_permission(user, command.need_permission)))) {
                data.push(command_name)
            }
        })

        if (data.length) {
            out += `\n**${command_dir.toUpperCase()}**\n${data.join("\n")}\n`
        }
    })

    return out
}

module.exports = { command_tree, from_guild, from_dm, check_args, is_admin, has_permission, permitted_commands_to_string }
