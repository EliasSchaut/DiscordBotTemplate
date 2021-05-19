const { prefix, lang } = require('../../config/config.json');
const text = require(`../../config/text_${lang}.json`).commands.help;

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

        if (!args.length) {
            data.push(text.intro[0]);
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\n${text.intro[1]} \`${prefix}${this.name} ${this.usage}\` ${text.intro[2]}!`);

            return message.author.send(data, { split: true })
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

        message.channel.send(data, { split: true });
    },
};
