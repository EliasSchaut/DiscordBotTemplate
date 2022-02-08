// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-command

const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.<name>."

module.exports = {
    name: '<name>',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['<alias_1>', '<alias_2>'],
    args_needed: false,
    args_min_length: 0,
    args_max_length: 0,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    guild_only: false,
    dm_only: false,
    need_permission: ['<permission1>', '<permission2>'],
    admin_only: false,
    nsfw: false,
    disabled: false,
    enable_slash: false,
    async execute(msg, args) {  // msg = discord.js 'Message' object; args = given arguments as list
        // your lovely code to execute
    },
};
