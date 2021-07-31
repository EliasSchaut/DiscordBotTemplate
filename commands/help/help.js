// ===============================
// The help command provides useful information about all the oder commands. The command works dynamically.
// If help is called without arguments, it will print all for the author from message executable commands.
// If help is called with a command name as argument, it prints information about this specific command.
// Here the help command uses the informations of the given command (like name, description, usage, ...).
// ===============================

const { prefix, embed } = require('../../config/config.json');
const helper = require("../../js/helper.js")
const { logger } = require("../../js/logger")
const Discord = require("discord.js")
const { MessageMenuOption, MessageMenu } = require('discord-buttons')
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
            return msg.author.send(await create_embed_all_commands(this), await create_command_menu(msg, commands))
                .then(async () => {
                    if (helper.from_guild(msg)) {
                        msg.channel.send(await create_embed_to_dm())
                    }
                })
                .catch(async error => {
                    logger.log('error', `${await gt(msg, s + "dm.fail_console")} ${msg.author.tag}.\n`, error);
                    msg.reply(await gt(msg, s + "dm.fail_reply"));
                });

        // help information for a specific command
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return msg.reply(await gt(msg, s + "invalid_command"));
            }

            msg.channel.send(await create_embed_specific_command(command), await create_command_menu(msg, commands))
        }


        // ----------------------------
        // Helper
        // ----------------------------
            async function create_embed_to_dm() {
            return new Discord.MessageEmbed()
                .setDescription(`<@${msg.author.id}> ${await gt(msg, s + "dm.success")} ${helper.link_to_dm(msg, await gt(msg, s + "jump_to_dm"))}!`)
                .setColor(embed.color)
                .setThumbnail(embed.avatar_url)
        }

        async function create_embed_all_commands(help) {
            const data = []
            const embed_msg = new Discord.MessageEmbed().setColor(embed.color)
            embed_msg.setThumbnail(embed.avatar_url)

            data.push(`${await gt(msg, s + "intro.0")}`);
            data.push(helper.permitted_commands_to_string(helper.command_tree, msg));
            data.push(`\n${await gt(msg, s + "intro.1")} \`${prefix}${help.name} ${await help.usage(msg)}\` ${await gt(msg, s + "intro.2")}`);
            data.push(helper.link_to_message(msg, await gt(msg, s + "back_to_message")))
            embed_msg.setTitle(`${help.name.toUpperCase()} ${(await gt(msg, s + "command")).toUpperCase()}`)
            embed_msg.setDescription(data)

            return embed_msg
        }

        async function create_embed_specific_command(command) {
            const data = []
            const embed_msg = new Discord.MessageEmbed().setColor(embed.color)

            if (command.aliases) data.push(`${await gt(msg, s + "success.aliases")}\n${command.aliases.join(', ')}\n`);
            if (command.description) data.push(`${await gt(msg, s + "success.description")}\n${await command.description(msg)}\n`);
            if (command.usage) data.push(`${await gt(msg, s + "success.usage")}\n\`${prefix}${command.name} ${await command.usage(msg)}\`\n`);

            embed_msg.setTitle(`${command.name.toUpperCase()} ${(await gt(msg, s + "command")).toUpperCase()}`)
            embed_msg.setDescription(data)
            embed_msg.setThumbnail(embed.avatar_url)

            return embed_msg
        }

        async function create_command_menu(msg, commands) {
            let options = [await new MessageMenuOption()
                .setLabel("A Commands")
                .setValue("all")
                .setDescription("List a summary of all commands")]
            for (const command of commands) {
                let description = await command[1].description(msg)
                if (description.length >= 46) {
                    description = description.substring(0, 46).trim() + " ..."
                }

                options.push(await new MessageMenuOption()
                    .setLabel(command[1].name)
                    .setValue(command[1].name)
                    .setDescription(description))
            }

            return new MessageMenu()
                .setID('commands')
                .setPlaceholder('Select Commands')
                .setMaxValues(1)
                .setMinValues(1)
                .addOptions(options)
        }
        // ----------------------------
    },
};
