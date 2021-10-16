// ===============================
// The ping command returns the websocket heartbeat and the roundtrip latency.
// ===============================

const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.ping."

module.exports = {
    name: 'ping',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['p'],
    enable_slash: true,
    async execute(msg, args) {
        // websocket heartbeat
        msg.channel.send(`${await gt(msg, s + "websocket")} ${msg.mentions.client.ws.ping}ms.`);

        // roundtrip latency
        msg.channel.send(await gt(msg, s + "pinging")).then(async send => {
            send.edit(`${await gt(msg, s + "roundtrip")} ${send.createdTimestamp - msg.createdTimestamp}ms`);
        });
    },
};
