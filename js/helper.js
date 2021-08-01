// ===============================
// This file provides different useful methods, which are used by commands or index
// ===============================

// ----------------------------
// Export
// ----------------------------
// checks, if given message is from guild (a discord server)
function from_dm(msg) {
    return msg.channel.type === 'dm'
}

// checks, if given message is from dm (personal chat with bot)
function from_guild(msg) {
    return msg.channel.type === 'text' || msg.channel.type === 'news'
}

function is_nsfw_channel(msg) {
    return from_dm(msg) || msg.channel.nsfw
}

// checks structural correctness of given args (by now only command length)
function check_args(command, args) {
    return !command.hasOwnProperty("args_min_length") || args.length >= command.args_min_length
}

// check if author from message is admin
function is_admin(msg) {
    if (from_dm(msg)) {
        return is_admin_from_dm(msg)

    } else {
        return is_admin_from_guild(msg)
    }
}

// check, if the author from message have all of the given permissions as list
function has_permission(msg, permission_list) {
    if (from_dm(msg)) {
        return false
    }
    return msg.member.hasPermission(permission_list)
}

// check, it the author from message is permitted to run given command
function is_permitted(msg, command) {
    return (!((command.hasOwnProperty("admin_only") && command.admin_only && !is_admin(msg))
        ||  (command.hasOwnProperty("need_permission") && !has_permission(msg, command.need_permission))))
}

// print all executable commands for the author from message in a human readable string
function permitted_commands_to_string(msg) {
    let out = ""
    Object.keys(msg.client.command_tree).forEach(function (command_dir) {
        let data = []

        Object.keys(msg.client.command_tree[command_dir]).forEach(function (command_name) {
            const command = msg.client.command_tree[command_dir][command_name]

            // user is admin or permitted
            if (is_permitted(msg, command)) {
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
function link_to_dm(msg, text = "") {
    let link = `https://discord.com/channels/@me/${msg.author.dmChannel.id}/`
    if (text !== "") link = custom_text_to_link(link, text)
    return link
}

// returns a link to the sended message
// note: custom text works only in embed
function link_to_message(msg, text = "") {
    let link;
    if (from_dm(msg)) {
        link = link_to_dm(msg) + msg.id

    } else if (from_guild(msg)) {
        link = `https://discord.com/channels/${msg.channel.guild.id}/${msg.channel.id}/${msg.id}`
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
function is_admin_from_dm(msg) {
    return msg.client.config.user_ids_admin.includes(msg.author.id)
}

// check, if the author from message is an admin when chatting per guild
function is_admin_from_guild(msg) {
    return msg.client.config.user_ids_admin.includes(msg.member.id)
        || msg.member.roles.cache.some(role => msg.client.config.role_ids_admin.includes(role.id))
}
// ----------------------------


module.exports = { from_guild, from_dm, is_nsfw_channel, check_args, is_admin, has_permission,
    is_permitted, permitted_commands_to_string, link_to_dm, link_to_message }
