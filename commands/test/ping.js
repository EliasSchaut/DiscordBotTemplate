const { lang } = require("../../config/config.json");
const text = require(`../../config/text_${lang}.json`).commands.ping;

module.exports = {
    name: 'ping',
    description: text.help,
    aliases: ['p'],
    args: false,
    guildOnly: false,
    dmOnly: false,
    restricted: false,
    execute(message, args) {
        message.channel.send(`${text.websocket} ${message.mentions.client.ws.ping}ms.`);

        message.channel.send(text.pinging).then(send => {
            send.edit(`${text.roundtrip} ${send.createdTimestamp - message.createdTimestamp}ms`);
        });
    },
};