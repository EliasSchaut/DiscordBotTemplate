// ===============================
// The ping command returns the websocket heartbeat and the roundtrip latency.
// ===============================

const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.ping"

module.exports = {
    name: 'ping',
    description: async function (msg) { return await gt(msg, "help", s) },
    aliases: ['p'],
    async execute(msg, args) {
        // websocket heartbeat
        msg.channel.send(`${await gt(msg, "websocket", s)} ${msg.mentions.client.ws.ping}ms.`);

        // roundtrip latency
        msg.channel.send(await gt(msg, "pinging", s)).then(async send => {
            send.edit(`${await gt(msg, "roundtrip", s)} ${send.createdTimestamp - msg.createdTimestamp}ms`);
        });
    },
};
