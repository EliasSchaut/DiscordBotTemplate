// ===============================
// The prefix command is only usable, if 'enable_prefix_change' in config is true (see disabled: !enable_prefix_change)
// If prefix is called without arguments, the command shows the current used prefix of the guild from message.
// If prefix is called with a prefix as argument, it will change the prefix for the guild from message to it.
// ===============================

const { get_text: gt } = require("../../lang/lang_man")
const { enable_prefix_change } = require("../../../config/config.json")
const s = "commands.prefix."

module.exports = {
    name: 'prefix',
    description: async function (msg) { return `${(await gt(msg, s + "help"))}}` },
    aliases: ['pre'],
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: true,
    args_min_length: 0,
    args_max_length: 1,
    need_permission: [ "ADMINISTRATOR" ],
    disabled: !enable_prefix_change,
    async execute(msg, args) {
        if (args.length > 0) {
            if (args[0].length > 2000) {
                return msg.client.output.send(msg, `${await gt(msg, s + "too_long")}`)
            }
            await msg.client.DB.Guild.set_prefix(msg, args[0])
            return msg.client.output.send(msg, await gt(msg, s + "set",  `\`${args[0]}\``))

        } else {
            return msg.client.output.send(msg, await gt(msg, s + "get", `\`${await msg.client.DB.Guild.get_prefix(msg)}\``))
        }
    },
};