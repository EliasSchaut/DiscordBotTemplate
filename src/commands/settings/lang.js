// ===============================
// The lang command is only usable, if 'enable_lang_change' in config is true (see disabled: !enable_lang_change)
// If lang is called without arguments, the command shows the current used language of the author from message.
// If lang is called with a valid language as argument (see config), it will change the language for the author from message to it
// ===============================

const { get_text: gt, is_valid: iv } = require("../../lang/lang_man")
const { enable_lang_change, lang_paths } = require("../../../config/config.json")
const s = "commands.lang."

module.exports = {
    name: 'lang',
    description: async function (msg) { return `${(await gt(msg, s + "help"))} ${Object.keys(lang_paths).join(", ")}` },
    aliases: ['change_lang', 'language', 'cl'],
    args_min_length: 0,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    disabled: !enable_lang_change,
    enable_slash: true,
    async execute(msg, args) {
        if (args.length > 0) {
            if (iv(args[0])) {
                if (await msg.client.DB.User_Lang.set(msg, args[0])) {
                    msg.client.output.send(msg, await gt(msg, `${s}set`, `\`${args[0]}\``))

                } else {
                    msg.client.output.reply(msg, await gt(msg, `${s}error`, `${msg.author.username}`))
                }

            } else {
                return msg.client.output.reply(msg, await gt(msg, s + "invalid"))
            }

        } else {
            return msg.client.output.send(msg, await gt(msg, s + "get", `\`${await msg.client.DB.User_Lang.get(msg)}\``))
        }
    },
};
