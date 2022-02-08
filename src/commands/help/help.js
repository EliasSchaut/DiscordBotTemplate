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
            return await this.send_all_commands(msg)

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
        // send to dm if send_to_dm in config is true
        if (msg.client.config.help.send_to_dm && msg.client.helper.from_guild(msg)) {
            return await msg.client.output.send_to_dm(msg, { embeds: [await this.create_embed_all_commands(msg)], components: [await this.create_command_menu(msg)] })
                .then(async () => {
                    msg.client.output.send(msg, {embeds: [await msg.client.helper.create_embed_to_dm(msg)]})
                })

        // send straight in this channel
        } else {
            return msg.client.output.send(msg, { embeds: [await this.create_embed_all_commands(msg)], components: [await this.create_command_menu(msg)] })
        }
    },

    async send_specific_command(msg, command) {
        // send to dm if send_to_dm in config is true
        if (msg.client.config.help.send_to_dm && msg.client.helper.from_guild(msg)) {
            return await msg.client.output.send_to_dm(msg, { embeds: [await this.create_embed_specific_command(msg, command)], components: [await this.create_command_menu(msg)] })
                .then(async () => {
                    msg.client.output.send(msg, {embeds: [await msg.client.helper.create_embed_to_dm(msg)]})
                })

        // send straight in this channel
        } else {
            return msg.client.output.send(msg, { embeds: [await this.create_embed_specific_command(msg, command)], components: [await this.create_command_menu(msg)] })
        }
    },

    // create an embed with information about all commands
    async create_embed_all_commands(msg) {
        const prefix = await msg.client.DB.Guild.get_prefix(msg)
        const description = await gt(msg, s + "intro", await msg.client.helper.commands_to_string(msg),
            `\`${prefix}${this.name} ${await this.usage(msg)}\``)

        return await this.create_embed_help_format(msg, this.name, description)
    },

    // create an embed with information about a given specific command
    async create_embed_specific_command(msg, command) {
        const prefix = await msg.client.DB.Guild.get_prefix(msg)
        const description = []

        const name = await msg.client.mods.name.get(msg, command)
        const aliases = await msg.client.mods.aliases.get(msg, command)
        const cmd_description = await msg.client.mods.description.get(msg, command)
        const usage = await msg.client.mods.usage.get(msg, command)
        if (aliases.length) description.push(`${await gt(msg, s + "success.aliases")}\n${aliases.join(', ')}\n`)
        if (cmd_description) description.push(`${await gt(msg, s + "success.description")}\n${cmd_description}\n`)
        if (usage) description.push(`${await gt(msg, s + "success.usage")}\n\`${prefix}${name} ${usage}\`\n`)
        if (msg.client.config.help.show_cmd_modifications) description.push(`${(await msg.client.mod_man.get_mods_for_help(msg, command)).join("\n")}`)

        return await this.create_embed_help_format(msg, name, description.join("\n"))
    },

    // actually generates an embed_msg in help format
    async create_embed_help_format(msg, title, description, fields = []) {
        const embed_msg = new Discord.MessageEmbed()
            .setColor(msg.client.config.embed.color)
            .setTitle(`${title.toUpperCase()} ${(await gt(msg, s + "command")).toUpperCase()}`)
            .setDescription(description)
            .addFields(fields)
            .setThumbnail(msg.client.config.embed.avatar_url)

        // add link connection between dm msg and server msg
        if (msg.client.config.help.send_to_dm && msg.client.helper.from_guild(msg)) {
            embed_msg.addField("\u200B" , msg.client.helper.link_to_message(msg, await gt(msg, s + "back_to_message")))
        }

        return embed_msg
    },

    // generates the command menu holding all for the author visible commands
    async create_command_menu(msg) {
        let options = [{
            label: await gt(msg, s + "menu.all_label"),
            value: "all",
            description: await gt(msg, s + "menu.all_description")
        }]

        for (const command of msg.client.commands) {
            if (msg.client.config.help.show_only_permitted_commands && !await msg.client.helper.is_permitted(msg, command[1])) continue
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
