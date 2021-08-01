// ===============================
// This is the entry point of the whole programm!
// This file will collect every needed package or code file together and start the discord bot.
// In this file is also the event listener for every incoming message for the bot.
// This file checks, if the message is a valid command and if so, it will execute.
// ===============================


// ---------------------------------
// Preparations
// ---------------------------------
// require node's native file system module.
const fs = require('fs')

// require the discord.js module and set everything important to client
const Discord = require('discord.js')
const client = new Discord.Client()

// get required methods and fields and save it into client. This will always be accessible with message.client!
client.commands = new Discord.Collection()
client.config = require('./config/config.json')
client.helper = require('./js/helper.js')
client.lang_helper = require("./lang/lang_helper")
client.db_helper = require('./db/db_helper')
client.DB = require('./db/db_init.js').DB
client.sequelize = require('./db/db_init.js').sequelize
client.logger = require("./js/logger").logger

// helper fields
const gt = client.lang_helper.get_text
const commands_path = "./commands"
const s = "index."

// get discord buttons (See also https://discord-buttons.js.org/docs/stable/)
const disbut = require('discord-buttons')
disbut(client)

// dynamically retrieve all command files and additionally save it into client.command_tree
let command_tree = {}
const commandFolders = fs.readdirSync(commands_path)
for (const folder of commandFolders) {
    command_tree[folder] = {}
    const commandFiles = fs.readdirSync(`${commands_path}/${folder}`).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const command = require(`${commands_path}/${folder}/${file}`)
        if (command.hasOwnProperty("disabled") && command.disabled) continue
        client.commands.set(command.name, command)
        command_tree[folder][command.name] = command
    }
}
client.command_tree = command_tree
// ---------------------------------



// ---------------------------------
// Event-Handler
// ---------------------------------

// when the client is ready (bot is ready)
client.once('ready', async () => {

    // set activity
    if (client.config.enable_activity) {
        await client.user.setActivity(client.config.activity.name, {type: client.config.activity.type})
    }

    // sync database
    await client.sequelize.sync()

    // log ready info
    client.logger.log('info', 'Ready!')
});

// react on messages
client.on('message', async msg => {
    // check prefix and prepare message
    const prefix = client.config.enable_prefix_change ? await client.db_helper.get_prefix(msg) : client.config.prefix
    if (!msg.content.startsWith(prefix) || msg.author.bot) return
    const args = msg.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase();

    // search for aliases
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if (!command) return;

    // checks admin only
    if (command.hasOwnProperty("admin_only") && command.admin_only && !client.helper.is_admin(msg)) {
        return msg.reply(await gt(msg, `${s}restricted`))
    }

    // checks permissions
    if (command.hasOwnProperty("need_permission") && command.need_permission.length
        && !client.helper.has_permission(msg, command.need_permission)) {
        return msg.reply(await gt(msg, `${s}restricted`))
    }

    // checks guild only
    if (command.hasOwnProperty("guild_only") && command.guild_only && !client.helper.from_guild(msg)) {
        return msg.reply(await gt(msg, `${s}guild_only`))
    }

    // checks dm only
    if (command.hasOwnProperty("dm_only") && command.dm_only && !client.helper.from_dm(msg)) {
        return msg.reply(await gt(msg, `${s}dm_only`))
    }

    // nsfw
    if (command.hasOwnProperty("nsfw") && command.nsfw && !client.helper.is_nsfw_channel(msg)) {
        return msg.reply(await gt(msg, `${s}nsfw_only`))
    }

    // checks missing args
    if (command.hasOwnProperty("args_needed") && command.args_needed && !client.helper.check_args(command, args)) {
        let reply = `${await gt(msg, `${s}missing_args`)}, ${msg.author}`

        if (command.hasOwnProperty("usage") && command.usage) {
            reply += `\n${(await gt(msg, `${s}missing_args_proper_use`))} \`${prefix}${command.name} ${await command.usage(msg)}\``
        }

        return msg.channel.send(reply)
    }

    // try to execute
    try {
        command.execute(msg, args)

    } catch (e) {
        client.logger.log("error", e)
        msg.reply(await gt(msg, `${s}error`))
    }
});

// when a discord-button was pressed
client.on("clickButton", async (button) => {

})

// when a discord-menu was chosen
client.on("clickMenu", async (menu) => {
    if (menu.id === "help") {
        const menu_msg = menu.message
        const val = menu.values[0]
        const clicker_msg = menu_msg
        clicker_msg.author = menu.clicker.user

        if (val === 'all') {
            await menu_msg.edit(await menu.client.commands.get("help").create_embed_all_commands(clicker_msg),
                menu.client.commands.get("help").create_command_menu(clicker_msg, menu.client.commands))

        } else {
            await menu_msg.edit(await menu.client.commands.get("help").create_embed_specific_command(clicker_msg, menu.client.commands.get(val)),
                menu.client.commands.get("help").create_command_menu(clicker_msg, menu.client.commands))
        }

        menu.reply.defer(true)
    }
})
// ---------------------------------

// login to Discord with app's token
client.login(client.config.token)
