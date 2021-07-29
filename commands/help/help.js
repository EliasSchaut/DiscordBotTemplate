// ===============================
// The help command provides useful information about all the oder commands. The command works dynamically.
// If help is called without arguments, it will print all for the author from message executable commands.
// If help is called with a command name as argument, it prints information about this specific command.
// Here the help command uses the informations of the given command (like name, description, usage, ...).
// ===============================

const { prefix, embed_color, } = require('../../config/config.json');
const helper = require("../../js/helper.js")
const { logger } = require("../../js/logger")
const Discord = require("discord.js")
const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.help"

module.exports = {
    name: 'help',
    description: async function (msg) { return await gt(msg, "help", s) },
    aliases: ['commands', 'h'],
    args_needed: true,
    args_min_length: 0,
    usage: async function (msg) { return await gt(msg, "usage", s) },
    async execute(msg, args) {
        const data = [];
        const { commands } = msg.client;
        const embed = new Discord.MessageEmbed().setColor(embed_color)

        // help information for all command
        if (!args.length) {
            data.push(`${await gt(msg, "0", s + ".intro")}`);
            data.push(helper.permitted_commands_to_string(helper.command_tree, msg));
            data.push(`\n${await gt(msg, "1", s + ".intro")} \`${prefix}${this.name} ${await this.usage(msg)}\` ${await gt(msg, "2", s + ".intro")}!`);
            data.push(helper.link_to_message(msg, await gt(msg, "back_to_message", s)))
            embed.setTitle(`${this.name.toUpperCase()} ${(await gt(msg, "command", s)).toUpperCase()}`)
            embed.setDescription(data)

            return msg.author.send(embed)
                .then(async () => {
                    if (helper.from_dm(msg)) return;
                    msg.channel.send(new Discord.MessageEmbed()
                        .setDescription(`<@${msg.author.id}> ${await gt(msg, "success", s + ".dm")} ${helper.link_to_dm(msg, await gt(msg, "jump_to_dm", s))}!`)
                        .setColor(embed_color))
                })
                .catch(async error => {
                    logger.log('error', `${await gt(msg, "fail_console", s + ".dm")} ${msg.author.tag}.\n`, error);
                    msg.reply(await gt(msg, "fail_reply", s + ".dm"));
                });

        } else { // help information for a specific command
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return msg.reply(await gt(msg, "invalid_command", s));
            }

            if (command.aliases) data.push(`${await gt(msg, "aliases", s + ".success")}\n${command.aliases.join(', ')}\n`);
            if (command.description) data.push(`${await gt(msg, "description", s + ".success")}\n${await command.description(msg)}\n`);
            if (command.usage) data.push(`${await gt(msg, "usage", s + ".success")}\n\`${prefix}${command.name} ${await command.usage(msg)}\`\n`);

            embed.setTitle(`${command.name.toUpperCase()} ${(await gt(msg, "command", s)).toUpperCase()}`)
            embed.setDescription(data)
            msg.channel.send(embed)
        }
    },
};
