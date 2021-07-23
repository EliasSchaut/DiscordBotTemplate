const { prefix, lang, embed_color } = require('../../config/config.json');
const text = require(`../../config/text_${lang}.json`).commands.help;
const helper = require("../../js/helper.js")
const Discord = require("discord.js")

module.exports = {
    name: 'help',
    description: text.help,
    aliases: ['commands', 'h'],
    args: false,
    usage: text.usage,
    guildOnly: false,
    dmOnly: false,
    restricted: false,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        const embed = new Discord.MessageEmbed()
            .setColor(embed_color)
            .setTitle(`${this.name.toUpperCase()} ${text.command.toUpperCase()}`)

        if (!args.length) {
            data.push(`${text.intro[0]}`);
            data.push(permitted_commands_to_string(helper.command_tree, message.author.id));
            data.push(`\n${text.intro[1]} \`${prefix}${this.name} ${this.usage}\` ${text.intro[2]}!`);
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
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(text.invalid_command);
        }

        data.push(`${text.success.name} ${command.name}`);

        if (command.aliases) data.push(`${text.success.aliases} ${command.aliases.join(', ')}`);
        if (command.description) data.push(`${text.success.description} ${command.description}`);
        if (command.usage) data.push(`${text.success.usage} \`${prefix}${command.name} ${command.usage}\``);

        message.channel.send(embed);



        // -----------------------
        // Helper
        // -----------------------
        function permitted_commands_to_string(command_tree, user_id) {
            let out = ""
            Object.keys(command_tree).forEach(function (command_dir) {
                let data = []

                Object.keys(command_tree[command_dir]).forEach(function (command) {
                    if (!((command_tree[command_dir][command].restricted && !helper.is_permitted(user_id)))) {
                        data.push(command)
                    }
                })

                if (data) {
                    out += `\n**${command_dir.toUpperCase()}**\n${data.join("\n")}\n`
                }
            })

            return out
        }
        // -----------------------
    },
};
