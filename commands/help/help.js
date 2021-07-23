const { prefix, lang, embed_color } = require('../../config/config.json');
const text = require(`../../config/text_${lang}.json`).commands.help;
const helper = require("../../js/helper.js")
const Discord = require("discord.js")

module.exports = {
    name: 'help',
    description: text.help,
    aliases: ['commands', 'h'],
    args_needed: true,
    args_min_length: 0,
    usage: text.usage,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        const embed = new Discord.MessageEmbed().setColor(embed_color)

        // help information for all command
        if (!args.length) {
            data.push(`${text.intro[0]}`);
            data.push(helper.permitted_commands_to_string(helper.command_tree, message.author));
            data.push(`\n${text.intro[1]} \`${prefix}${this.name} ${this.usage}\` ${text.intro[2]}!`);
            embed.setTitle(`${this.name.toUpperCase()} ${text.command.toUpperCase()}`)
            embed.setDescription(data)

            return message.author.send(embed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(text.dm.success);
                })
                .catch(error => {
                    console.error(`${text.dm.fail_console} ${message.author.tag}.\n`, error);
                    message.reply(test.dm.fail_reply);
                });

        } else { // help information for a specific command
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.reply(text.invalid_command);
            }

            if (command.aliases) data.push(`${text.success.aliases}\n${command.aliases.join(', ')}\n`);
            if (command.description) data.push(`${text.success.description}\n${command.description}\n`);
            if (command.usage) data.push(`${text.success.usage}\n\`${prefix}${command.name} ${command.usage}\`\n`);

            embed.setTitle(`${command.name.toUpperCase()} ${text.command.toUpperCase()}`)
            embed.setDescription(data)
            message.channel.send(embed)
        }
    },
};
