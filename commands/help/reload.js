const fs = require('fs');
const { lang, commands_path } = require("../../config/config.json");
const text = require(`../../config/text_${lang}.json`).commands.reload;

module.exports = {
    name: 'reload',
    description: text.help,
    aliases: ['reloads', 'r'],
    args: true,
    args_min_length: 1,
    usage: text.usage,
    guildOnly: false,
    dmOnly: false,
    restricted: true,
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`${text.invalid_command} \`${commandName}\`, ${message.author}!`);
        }

        const commandFolders = fs.readdirSync(commands_path);
        const folderName = commandFolders.find(folder => fs.readdirSync(`${commands_path}/${folder}`).includes(`${commandName}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`\`${newCommand.name}\` ${text.success}`);
        } catch (error) {
            console.error(error);
            message.channel.send(`${text.fail} \`${command.name}\`:\n\`${error.message}\``);
        }
    },
};