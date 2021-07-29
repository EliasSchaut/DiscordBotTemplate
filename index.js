// ===============================
// This is the entry point of the whole programm!
// This file will collect every needed package or code file together and start the discord bot.
// In this file is also the event listener for every incoming message for the bot.
// This file checks, if the message is a valid command and if so, it will execute.
// ===============================

// get/set required methods and values
const config = require('./config/config.json')
const helper = require('./js/helper.js')
const prefix = config.prefix
const commands_path = "./commands"
const { logger } = require("./js/logger")
const { sequelize } = require('./db/db_init.js')
const { get_text: gt } = require("./lang/lang_helper") // get text in the correct language (used for responses in Discord)
const s = "index."

// require node's native file system module.
const fs = require('fs')

// require the discord.js module (See also https://discord.js.org/#/docs/main/stable/general/welcome)
const Discord = require('discord.js')
const client = new Discord.Client()
client.commands = new Discord.Collection()

// get discord buttons (See also https://discord-buttons.js.org/docs/stable/)
const disbut = require("discord-buttons")
disbut(client)

// dynamically retrieve all command files and additionally save it into helper.command_tree
let command_tree = {}
const commandFolders = fs.readdirSync(commands_path);
for (const folder of commandFolders) {
    command_tree[folder] = {}
    const commandFiles = fs.readdirSync(`${commands_path}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${commands_path}/${folder}/${file}`)
        if (command.hasOwnProperty("disabled") && command.disabled) continue
        client.commands.set(command.name, command)
        command_tree[folder][command.name] = command
    }
}
helper.command_tree = command_tree

// ---------------------------------
// Event-Handler
// ---------------------------------

// when the client is ready (bot is ready)
client.once('ready', async () => {
    await sequelize.sync()
    logger.log('info', 'Ready!');
});

// react on messages
client.on('message', async msg => {
    // check prefix and prepare message
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // search for aliases
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    // checks admin only
    if (command.hasOwnProperty("admin_only") && command.admin_only && !helper.is_admin(msg)) {
        return msg.reply(await gt(msg, s + "restricted"));
    }

    // checks permissions
    if (command.hasOwnProperty("need_permission") && command.need_permission.length
        && !helper.has_permission(msg, command.need_permission)) {
        return msg.reply(await gt(msg, s + "restricted"));
    }

    // checks guild only
    if (command.hasOwnProperty("guild_only") && command.guild_only && helper.from_guild(msg)) {
        return msg.reply(await gt(msg, s + "guild_only"));
    }

    // checks dm only
    if (command.hasOwnProperty("dm_only") && command.dm_only && helper.from_dm(msg)) {
        return msg.reply(await gt(msg, s + "dm_only"));
    }

    // checks missing args
    if (command.hasOwnProperty("args_needed") && command.args_needed && !helper.check_args(command, args)) {
        let reply = await gt(msg, s + "missing_args") + `, ${msg.author}`;

        if (command.hasOwnProperty("usage") && command.usage) {
            reply += `\n${(await gt(msg, s + "missing_args_proper_use"))} \`${prefix}${command.name} ${command.usage}\``;
        }

        return msg.channel.send(reply);
    }

    // try to execute
    try {
        command.execute(msg, args);

    } catch (e) {
        logger.log("error", e);
        msg.reply(await gt(msg, s + "error"));
    }
});
// ---------------------------------

// login to Discord with app's token
client.login(config.token);
