// ===============================
// This file provides different useful methods, which are used by commands or index
// ===============================

// ----------------------------
// Check Msg
// ----------------------------
const Discord = require("discord.js");
const {get_text: gt} = require("../lang/lang_man");

// checks, if given message is from dm (personal chat with bot)
function from_dm(msg) {
    return msg.channel.type === 'DM'
}

// checks, if given message is from guild (a discord server)
function from_guild(msg) {
    return msg.channel.type === 'GUILD_TEXT' || msg.channel.type === 'GROUP_DM'
        || msg.channel.type === 'GUILD_PUBLIC_THREAD' || msg.channel.type === 'GUILD_PRIVATE_THREAD'
}

// checks, if given message is from an nsfw channel
function is_nsfw_channel(msg) {
    return from_dm(msg) || (from_guild(msg) && msg.channel.nsfw)
}

// print all commands for the author from message in a human readable string
async function commands_to_string(msg) {
    let out = ""
    for (const command_dir of Object.keys(msg.client.command_tree)) {
        const data = []

        for (const command_name of Object.keys(msg.client.command_tree[command_dir])) {
            const command = msg.client.command_tree[command_dir][command_name]

            // user is admin or permitted (only needed if help.show_only_permitted_commands is true
            if (!msg.client.config.help.show_only_permitted_commands || await is_permitted(msg, command)) {
                data.push(`${command_name}`)
            }
        }

        if (data.length) {
            out += `\n**${command_dir.toUpperCase()}**\n${data.join("\n")}\n`
        }
    }

    return out
}

// returns a link of dm-channel between author and bot
// note: custom text works only in embed
function link_to_dm(msg, text = "") {
    let link = `https://discord.com/channels/@me/${msg.author.dmChannel.id}/`
    if (text !== "") link = custom_text_to_link(link, text)
    return link
}

// returns a link to the sent message
// note: custom text works only in embed
function link_to_message(msg, text = "") {
    let link;
    if (from_dm(msg)) {
        link = link_to_dm(msg) + msg.id

    } else if (from_guild(msg)) {
        link = `https://discord.com/channels/${msg.channel.guild.id}/${msg.channel.id}/${msg.id}`
    }
    if (text !== "") link = "\n" + custom_text_to_link(link, text)
    return link
}

async function create_embed_to_dm(msg) {
    const s = "commands.help."
    return new Discord.MessageEmbed()
        .setDescription(`<@${msg.author.id}> ${await gt(msg, s + "dm.success")} ${msg.client.helper.link_to_dm(msg, await gt(msg, s + "jump_to_dm"))}!`)
        .setColor(msg.client.config.embed.color)
        .setAuthor({ name: msg.client.config.embed.author_name, iconURL: msg.client.config.embed.avatar_url})
}

function check_interaction_custom_id(interaction, custom_id) {
    return interaction.customId === custom_id
}

function trim_text(string, size, use_dots) {
    const dots = " ..."

    if (string.length >= size) {

        if (use_dots) {
            string = string.substring(0, size - dots.length - 1).trim() + dots

        } else {
            string = string.substring(0, size - 1)
        }
    }
    return string
}


// --------------------
// Permissions
// --------------------
// check if author from message is admin
function is_admin(msg) {
    if (from_dm(msg)) {
        return is_admin_from_dm(msg)

    } else {
        return is_admin_from_guild(msg)
    }
}

// check, if the author from message have all the given permissions as list
function has_permission(msg, permission_list) {
    return !from_dm(msg) && msg.member.permissions.has(permission_list)
}

// check, if the author from message is permitted to run given command
async function is_permitted(msg, command) {
    const need_permission = await msg.client.mods.need_permission.get(msg, command)
    const admin_only = await msg.client.mods.admin_only.get(msg, command)

    if (!admin_only && (need_permission.length === 0)) {
        return true

    } else if (admin_only && is_admin(msg)) {
        return true

    } else if ((need_permission.length > 0) && has_permission(msg, need_permission)) {
        return true

    } else {
        return false
    }
}
// --------------------
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


module.exports = { from_guild, from_dm, is_nsfw_channel, is_admin, has_permission, is_permitted,
    commands_to_string, link_to_dm, link_to_message, create_embed_to_dm, check_interaction_custom_id, trim_text }
