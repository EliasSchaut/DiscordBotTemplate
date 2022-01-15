// ===============================
// The ping command returns the websocket heartbeat and the roundtrip latency.
// ===============================

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.ping."

module.exports = {
    name: 'ping',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['p'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    enable_slash: true,
    async execute(msg, args) {
        // websocket heartbeat
        await msg.client.output.send(msg, await gt(msg, s + "websocket", msg.client.ws.ping))

        // roundtrip latency
        msg.client.output.send(msg, await gt(msg, s + "pinging")).then(async send => {
            msg.client.output.edit(send, await gt(msg, s + "roundtrip", (send.createdTimestamp - msg.createdTimestamp)))
        })
    },
};
