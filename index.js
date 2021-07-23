// Node's native file system module.
const fs = require('fs')

// require the discord.js module
const Discord = require('discord.js')

// require the config.json and text.js module
const config = require('./config/config.json')
const text = require(`./config/text_${config.lang}.json`).index
const helper = require('./js/helper.js')
const prefix = config.prefix

// create a new Discord client
const client = new Discord.Client()
client.commands = new Discord.Collection()

// dynamically retrieve all command files and save it into helper file
command_tree = {}
const commandFolders = fs.readdirSync(config.commands_path);
for (const folder of commandFolders) {
    command_tree[folder] = {}
    const commandFiles = fs.readdirSync(`${config.commands_path}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${config.commands_path}/${folder}/${file}`)
        client.commands.set(command.name, command)
        command_tree[folder][command.name] = command
    }
}
helper.command_tree = command_tree


// ---------------------------------
// Event-Handler
// ---------------------------------

// when the client is ready
client.once('ready', () => {
    console.log('Ready!');
});

// react on messages
client.on('message', message => {
    // check prefix and prepare message
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // aliases
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    // guild only
    if (command.guildOnly && helper.from_guild(message)) {
        return message.reply(text.guild_only);
    }

    // dm only
    if (command.dmOnly && helper.from_dm(message)) {
        return message.reply(text.dm_only);
    }

    // restricted
    if (command.restricted && !helper.is_permitted(message.author.id)) {
        return message.reply(text.restricted);
    }

    // check missing args
    if (command.args && !helper.check_args(command, args)) {
        let reply = text.missing_args + `, ${message.author}!`;

        if (command.usage) {
            reply += "\n" + text.missing_args_proper_use + `\`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    // try to execute
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(text.error);
    }
});
// ---------------------------------

// login to Discord with app's token
client.login(config.token);