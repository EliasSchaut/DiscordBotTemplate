// ===============================
// This file provides different useful methods, which are used by commands or index
// ===============================

const config = require("../config/config.json")

// ----------------------------
// Export
// ----------------------------
// save the dirtree of folder commands in a json representation
// note: will used without getter/setter
let command_tree = []

// checks, if given message is from guild (a discord server)
function from_dm(message) {
    return message.channel.type === 'dm'
}

// checks, if given message is from dm (personal chat with bot)
function from_guild(message) {
    return message.channel.type === 'text' || message.channel.type === 'news'
}

function is_nsfw_channel(message) {
    return from_dm(message) || message.channel.nsfw
}

// checks structural correctness of given args (by now only command length)
function check_args(command, args) {
    return !command.hasOwnProperty("args_min_length") || args.length >= command.args_min_length
}

// check if author from message is admin
function is_admin(message) {
    if (from_dm(message)) {
        return is_admin_from_dm(message)

    } else {
        return is_admin_from_guild(message)
    }
}

// check, if the author from message have all of the given permissions as list
function has_permission(message, permission_list) {
    return message.member.hasPermission(permission_list)
}

// print all executable commands for the author from message in a human readable string
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

// returns a link of dm-channel between author and bot
// note: custom text works only in embed
function link_to_dm(message, text = "") {
    if (!message.author.hasOwnProperty("dmChannel")) {
        return ""
    }

    let link = `https://discord.com/channels/@me/${message.author.dmChannel.id}/`
    if (text !== "") link = custom_text_to_link(link, text)
    return link
}

// returns a link to the sended message
// note: custom text works only in embed
function link_to_message(message, text = "") {
    let link;
    if (from_dm(message)) {
        link = link_to_dm(message) + message.id

    } else if (from_guild(message)) {
        link = `https://discord.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id}`
    }
    if (text !== "") link = custom_text_to_link(link, text)
    return link
}
// ----------------------------


// ----------------------------
// Private
// ----------------------------
// add custom text to a link with markdown-syntax -> [Link Text](link)
function custom_text_to_link(link, text) {
    return `[${text}](${link})`
}

// check, if the author from message is an admin when chatting per dm
function is_admin_from_dm(message) {
    return config.user_ids_admin.includes(message.author.id)
}

// check, if the author from message is an admin when chatting per guild
function is_admin_from_guild(message) {
    return config.user_ids_admin.includes(message.member.id)
        || message.member.roles.cache.some(role => config.role_ids_admin.includes(role.id))
}
// ----------------------------


module.exports = { command_tree, from_guild, from_dm, is_nsfw_channel, check_args, is_admin, has_permission,
    permitted_commands_to_string, link_to_dm, link_to_message }
