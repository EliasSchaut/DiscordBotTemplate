const { lang } = require("../../config/config.json");
const text = require(`../../config/text_${lang}.json`).commands.echo;

module.exports = {
    name: 'echo',
    description: text.help,
    aliases: ['echos'],
    args: true,
    usage: text.usage,
    args_min_length: 1,
    guildOnly: false,
    dmOnly: false,
    restricted: false,
    execute(message, args) {
        message.channel.send(`${args}`);
    },
};