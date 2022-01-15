// ===============================
// The help command provides useful information about all the oder commands. The command works dynamically.
// If help is called without arguments, it will print all for the author from message executable commands.
// If help is called with a command name as argument, it prints information about this specific command.
// Here the help command uses the informations of the given command (like name, description, usage, ...).
// ===============================

const Discord = require("discord.js")
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.help."

module.exports = {
    name: 'help',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['commands', 'h'],
    args_min_length: 0,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    enable_slash: true,
    async execute(msg, args) {
        const { commands } = msg.client

        // help information for all command
        if (!args.length) {
            return this.send_all_commands(msg)

        // help information for a specific command
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return msg.client.output.reply(msg, await gt(msg, s + "invalid_command"));
            }

            return this.send_specific_command(msg, command)
        }
    },


    // ----------------------------
    // Helper
    // ----------------------------
    async send_all_commands(msg) {
        if (msg.client.config.help.send_to_dm && msg.client.helper.from_guild(msg)) {
            return await msg.client.output.send_to_dm(msg, { embeds: [await this.create_embed_all_commands(msg)], components: [await this.create_command_menu(msg)] }).then(async () => {
                msg.client.output.send(msg, {embeds: [await msg.client.helper.create_embed_to_dm(msg)]})
            })

        } else {
            return msg.client.output.send(msg, { embeds: [await this.create_embed_all_commands(msg)], components: [await this.create_command_menu(msg)] })
        }
    },

    async send_specific_command(msg, command) {
        if (msg.client.config.help.send_to_dm && msg.client.helper.from_guild(msg)) {
            return await msg.client.output.send_to_dm(msg, { embeds: [await this.create_embed_specific_command(msg, command)], components: [await this.create_command_menu(msg)] }).then(async () => {
                msg.client.output.send(msg, {embeds: [await msg.client.helper.create_embed_to_dm(msg)]})
            })

        } else {
            return msg.client.output.send(msg, { embeds: [await this.create_embed_specific_command(msg, command)], components: [await this.create_command_menu(msg)] })
        }
    },

    async create_embed_all_commands(msg) {
        const s = "commands.help."
        const prefix = await msg.client.DB.Guild.get_prefix(msg)
        const data = []
        const embed_msg = new Discord.MessageEmbed().setColor(msg.client.config.embed.color)
        embed_msg.setThumbnail(msg.client.config.embed.avatar_url)

        data.push(await gt(msg, s + "intro", msg.client.helper.commands_to_string(msg),
                `\`${prefix}${this.name} ${await this.usage(msg)}\``))
        if (msg.client.config.help.send_to_dm && msg.client.helper.from_guild(msg)) {
            data.push(msg.client.helper.link_to_message(msg, await gt(msg, s + "back_to_message")))
        }
        embed_msg.setTitle(`${this.name.toUpperCase()} ${(await gt(msg, s + "command")).toUpperCase()}`)
        embed_msg.setDescription(data.join(""))

        return embed_msg
    },

    async create_embed_specific_command(msg, command) {
        const s = "commands.help."
        const prefix = await msg.client.DB.Guild.get_prefix(msg)
        const data = []
        const embed_msg = new Discord.MessageEmbed().setColor(msg.client.config.embed.color)

        const name = await msg.client.mods.name.get(msg, command)
        const aliases = await msg.client.mods.aliases.get(msg, command)
        const description = await msg.client.mods.description.get(msg, command)
        const usage = await msg.client.mods.usage.get(msg, command)
        if (aliases.length) data.push(`${await gt(msg, s + "success.aliases")}\n${aliases.join(', ')}\n\n`)
        if (description) data.push(`${await gt(msg, s + "success.description")}\n${description}\n\n`)
        if (usage) data.push(`${await gt(msg, s + "success.usage")}\n\`${prefix}${name} ${usage}\`\n`)
        if (msg.client.config.help.show_cmd_modifications) data.push(`\n${(await msg.client.mod_man.get_mods_for_help(msg, command)).join("\n")}`)

        embed_msg.setTitle(`${name.toUpperCase()} ${(await gt(msg, s + "command")).toUpperCase()}`)
        embed_msg.setDescription(data.join(""))
        embed_msg.setThumbnail(msg.client.config.embed.avatar_url)

        return embed_msg
    },

    async create_command_menu(msg) {
        let options = [{
            label: await gt(msg, s + "menu.all_label"),
            value: "all",
            description: await gt(msg, s + "menu.all_description")
        }]

        for (const command of msg.client.commands) {
            if (msg.client.config.help.show_only_permitted_commands && !msg.client.helper.is_permitted(msg, command[1])) continue
            let name = await msg.client.mods.name.get(msg, command[1])
            let description = msg.client.helper.trim_text(await msg.client.mods.description.get(msg, command[1]), 50, true)

            options.push({
                label: name,
                value: name,
                description: description
            })
        }

        const menu = await new MessageSelectMenu()
            .setCustomId('help')
            .setPlaceholder(await gt(msg, s + "menu.placeholder"))
            .addOptions(options)

        menu.message = msg
        return new MessageActionRow().addComponents(menu)
    },
    // ----------------------------
};
