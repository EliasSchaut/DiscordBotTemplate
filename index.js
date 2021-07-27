// require node's native file system module.
const fs = require('fs') // fs-promises

// require the discord.js module (See also https://discord.js.org/#/docs/main/stable/general/welcome)
const Discord = require('discord.js')

// get required files and values
const config = require('./config/config.json')
const helper = require('./js/helper.js')
const prefix = config.prefix
const commands_path = "./commands"
const User_Lang = (config.enable_lang_change) ? require("./db/db_init.js").User_Lang : null
const { get_text } = require("./lang/lang_helper")
const scope = "index"

// create a new Discord client
const client = new Discord.Client()
client.commands = new Discord.Collection()

// get discord buttons (See also https://discord-buttons.js.org/docs/stable/)
const disbut = require("discord-buttons")
disbut(client)

// dynamically retrieve all command files and save it into helper file
let command_tree = {}
const commandFolders = fs.readdirSync(commands_path);
for (const folder of commandFolders) {
    command_tree[folder] = {}
    const commandFiles = fs.readdirSync(`${commands_path}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${commands_path}/${folder}/${file}`)
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
    if (config.enable_lang_change) User_Lang.sync()
    console.log('Ready!');
});

// react on messages
client.on('message', async message => {
    // check prefix and prepare message
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // aliases
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    // admin only
    if (command.hasOwnProperty("admin_only") && command.admin_only && !helper.is_admin(message)) {
        return message.reply(get_text(message, "restricted", scope));
    }

    // checks permissions
    if (command.hasOwnProperty("need_permission") && command.need_permission.length
        && !helper.has_permission(message, command.need_permission)) {
        return message.reply(get_text(message, "restricted", scope));
    }

    // guild only
    if (command.hasOwnProperty("guild_only") && command.guild_only && helper.from_guild(message)) {
        return message.reply(get_text(message, "guild_only", scope));
    }

    // dm only
    if (command.hasOwnProperty("dm_only") && command.dm_only && helper.from_dm(message)) {
        return message.reply(get_text(message, "dm_only", scope));
    }

    // check missing args
    if (command.hasOwnProperty("args_needed") && command.args_needed && !helper.check_args(command, args)) {
        let reply = get_text(message, "missing_args", scope) + `, ${message.author}!`;

        if (command.usage) {
            reply += "\n" + get_text(message, "missing_args_proper_use", scope) + `\`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    // try to execute
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(get_text(message, "error", scope));
    }
});
// ---------------------------------

// login to Discord with app's token
client.login(config.token);