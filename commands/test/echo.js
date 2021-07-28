// ===============================
// The echo command just respond with the given arguments.
// This is useful to check, if the bot is still alive.
// ===============================

const { get_text: gt } = require("../../lang/lang_helper")
const s = "commands.echo"

module.exports = {
    name: 'echo',
    description: async function (msg) { return await gt(msg, "help", s) },
    aliases: ['echos'],
    args_needed: true,
    usage: async function (msg) { return await gt(msg, "usage", s) },
    args_min_length: 1,
    async execute(msg, args) {
        msg.channel.send(args.join(" "));
    },
};
