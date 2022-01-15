// ===============================
// The reload command reloads a given command while executing.
// This is useful for debugging, because a command can be updated without restarting the bot
// The command can only executed by admins (see admin_only: true)
// ===============================

const fs = require('fs');
const { get_text: gt } = require("../../lang/lang_man")
const s = "commands.reload."
const commands_path = "./commands"

module.exports = {
    name: 'reload',
    description: async function (msg) { return await gt(msg, s + "help") },
    aliases: ['reloads', 'r'],
    args_needed: true,
    args_min_length: 1,
    args_max_length: 1,
    usage: async function (msg) { return await gt(msg, s + "usage") },
    admin_only: true,
    disabled: true,
    async execute(msg, args) {
        const commandName = args[0].toLowerCase();
        const command = msg.client.commands.get(commandName)
            || msg.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return msg.client.output.reply(msg, await gt(msg, s + "invalid_command", `\`${commandName}\``))
        }

        const commandFolders = fs.readdirSync(commands_path);
        const folderName = commandFolders.find(folder => fs.readdirSync(`${commands_path}/${folder}`).includes(`${commandName}.js`));
        const name = await msg.client.mods.name.get(msg, command)

        delete require.cache[require.resolve(`../${folderName}/${name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${name}.js`);
            await msg.client.commands.set(name, newCommand);
            msg.client.output.send(msg, await gt(msg, s + "success", `\`${name}\``));
        } catch (error) {
            msg.client.logger.log('error', error);
            msg.client.output.send(msg, await gt(msg, s + "fail", `\`${name}\``, `\`${error.message}\``))
        }
    },
};
