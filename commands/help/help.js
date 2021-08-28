// ===============================
// The help command provides useful information about all the oder commands. The command works dynamically.
// If help is called without arguments, it will print all for the author from message executable commands.
// If help is called with a command name as argument, it prints information about this specific command.
// Here the help command uses the informations of the given command (like name, description, usage, ...).
// ===============================

const Discord = require("discord.js")
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.help."

module.exports = {
    name: 'help',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['commands', 'h'],
    args_needed: true,
    args_min_length: 0,
    usage: async function (msg) { return await gt(msg, s + "usage") },
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
                return msg.reply(await gt(msg, s + "invalid_command"));
            }

            msg.channel.send({ embeds: [await this.create_embed_specific_command(msg, command)], components: [await this.create_command_menu(msg)] })
        }
    },


    // ----------------------------
    // Helper
    // ----------------------------
    async send_all_commands(msg) {
        if (msg.client.config.help.send_to_dm && msg.client.helper.from_guild(msg)) {
            return await msg.author.send({ embeds: [await this.create_embed_all_commands(msg)], components: [await this.create_command_menu(msg)] }).then(async () => {
                msg.channel.send({embeds: [await this.create_embed_to_dm(msg)]})
            })

        } else {
            return msg.channel.send({ embeds: [await this.create_embed_all_commands(msg)], components: [await this.create_command_menu(msg)] })
        }
    },

    async create_embed_to_dm(msg) {
        const s = "commands.help."
        return new Discord.MessageEmbed()
            .setDescription(`<@${msg.author.id}> ${await gt(msg, s + "dm.success")} ${msg.client.helper.link_to_dm(msg, await gt(msg, s + "jump_to_dm"))}!`)
            .setColor(msg.client.config.embed.color)
            .setThumbnail(msg.client.config.embed.avatar_url)
    },

    async create_embed_all_commands(msg) {
        const s = "commands.help."
        const prefix = await msg.client.db_helper.get_prefix(msg)
        const data = []
        const embed_msg = new Discord.MessageEmbed().setColor(msg.client.config.embed.color)
        embed_msg.setThumbnail(msg.client.config.embed.avatar_url)

        data.push(`${await gt(msg, s + "intro.0")}\n`);
        data.push(msg.client.helper.commands_to_string(msg));
        data.push(`\n${await gt(msg, s + "intro.1")} \`${prefix}${this.name} ${await this.usage(msg)}\` ${await gt(msg, s + "intro.2")}\n`);
        if (msg.client.config.help.send_to_dm && msg.client.helper.from_guild(msg)) {
            data.push(msg.client.helper.link_to_message(msg, await gt(msg, s + "back_to_message")))
        }
        embed_msg.setTitle(`${this.name.toUpperCase()} ${(await gt(msg, s + "command")).toUpperCase()}`)
        embed_msg.setDescription(data.join(""))

        return embed_msg
    },

    async create_embed_specific_command(msg, command) {
        const s = "commands.help."
        const prefix = await msg.client.db_helper.get_prefix(msg)
        const data = []
        const embed_msg = new Discord.MessageEmbed().setColor(msg.client.config.embed.color)

        if (command.aliases) data.push(`${await gt(msg, s + "success.aliases")}\n${command.aliases.join(', ')}\n\n`);
        if (command.description) data.push(`${await gt(msg, s + "success.description")}\n${await command.description(msg)}\n\n`);
        if (command.usage) data.push(`${await gt(msg, s + "success.usage")}\n\`${prefix}${command.name} ${await command.usage(msg)}\`\n`);

        embed_msg.setTitle(`${command.name.toUpperCase()} ${(await gt(msg, s + "command")).toUpperCase()}`)
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
            let description = await command[1].description(msg)
            if (description.length >= 46) {
                description = description.substring(0, 46).trim() + " ..."
            }
            options.push({
                label: command[1].name,
                value: command[1].name,
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
