const config = require("../config/config.json")

let command_tree = []

// Checks, if given message is from guild (a discord server)
function from_dm(message) {
    return message.channel.type === 'dm'
}

// Checks, if given message is from dm (personal chat with bot)
function from_guild(message) {
    return message.channel.type === 'text' || message.channel.type === 'news' || message.channel.type === 'store'
}

// Checks structural correctness of given args
function check_args(command, args) {
    return !command.hasOwnProperty("args_min_length") || args.length >= command.args_min_length
}

// check if user from message is admin
function is_admin(message) {
    if (from_dm(message)) {
        return is_admin_from_dm(message.author)

    } else {
        return is_admin_from_guild(message.member)
    }
}

// check, if a given user is an admin when chatting per dm
function is_admin_from_dm(user) {
    return config.user_ids_admin.includes(user.id)
}

// check, if a given user is an admin when chatting per guild
function is_admin_from_guild(member) {
    return config.user_ids_admin.includes(member.id)
        || member.roles.cache.some(role => config.role_ids_admin.includes(role.id))
}

// Check, if a given user have all of the given permissions as list
function has_permission(message, permission_list) {
    return message.author.hasPermission(permission_list)
}

// print all executable commands for a given user in a human readable string
function permitted_commands_to_string(command_tree, message) {
    let out = ""
    Object.keys(command_tree).forEach(function (command_dir) {
        let data = []

        Object.keys(command_tree[command_dir]).forEach(function (command_name) {
            const command = command_tree[command_dir][command_name]

            // user is admin or permitted
            if (!((command.hasOwnProperty("admin_only") && command.admin_only && !is_admin(message))
                ||  (command.hasOwnProperty("need_permission") && !has_permission(message, command.need_permission)))) {
                data.push(`${command_name}`)
            }
        })

        if (data.length) {
            out += `\n**${command_dir.toUpperCase()}**\n${data.join("\n")}\n`
        }
    })

    return out
}

module.exports = { command_tree, from_guild, from_dm, check_args, is_admin, has_permission, permitted_commands_to_string }
