const db_helper = require("../../db/db_helper.js")
const { get_text: gt, is_valid: iv } = require("../../lang/lang_helper")
const { enable_lang_change } = require("../../config/config.json")
const s = "commands.lang"

module.exports = {
    name: 'lang',
    description: async function (msg) { return await gt(msg, "help", s) },
    aliases: ['change_lang', 'language', 'cl'],
    args_needed: false,
    args_min_length: 0,
    usage: async function (msg) { return await gt(msg, "usage", s) },
    async execute(msg, args) {
        if (!enable_lang_change) {
            return msg.reply(`Could not run, because lang change is not enabled`)
        }

        if (args.length > 0) {
            if (iv(args[0])) {
                await db_helper.set_lang(msg, args[0])
                return msg.channel.send(`${await gt(msg, "get", s)} ${args[0]}`)

            } else {
                return msg.reply(await gt(msg, "invalid", s))
            }

        } else {
            return msg.channel.send(`${await gt(msg, "get", s)} ${await db_helper.get_lang(msg)}`)
        }
    },
};