// ===============================
// This is the entry point of the whole program!
// This file will collect every needed package or code file together and start the discord bot.
// In this file is also the event listener for every incoming message for the bot.
// This file checks, if the message is a valid command and if so, it will execute.
// ===============================


// ---------------------------------
// Preparations
// ---------------------------------
// require needed modules.
const fs = require('fs')
const Discord = require('discord.js')

// create client with its intents
const client = new Discord.Client({ intents: [
        Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
        partials: ['CHANNEL']})

// get required methods and fields and save it into client. This will always be accessible with message.client
client.commands = new Discord.Collection()
client.config = require('./config/config.json')
client.helper = require('./js/cmd_helper')
client.lang_helper = require("./lang/lang_helper")
client.db_helper = require('./db/db_helper')
client.DB = require('./db/db_init').DB
client.sequelize = require('./db/db_init').sequelize
client.logger = require("./js/logger").logger
client.slasher = require("./js/slash_commands/slasher")
client.command_event = require("./js/event_helper/command_event")
client.slash_event = require("./js/event_helper/slash_event")
client.menu_event = require("./js/event_helper/menu_event")
client.button_event = require("./js/event_helper/button_event")
client.mod_getter = require("./js/cmd_modificator_getter")
client.output = require("./js/dc_output")

// helper fields
const commands_path = "./commands"

// dynamically retrieve all command files and additionally save it into message.client.command_tree
let command_tree = {}
const commandFolders = fs.readdirSync(commands_path)
for (const folder of commandFolders) {
    command_tree[folder] = {}
    const commandFiles = fs.readdirSync(`${commands_path}/${folder}`).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const command = require(`${commands_path}/${folder}/${file}`)
        const name = client.mod_manager.get_name(command)

        if (client.mod_manager.get_disabled(command)) continue
        client.commands.set(name, command)
        command_tree[folder][name] = command
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
        await client.user.setActivity(client.config.activity.name, { type: client.config.activity.type })
    }

    // sync database
    await client.sequelize.sync()

    // sync slash commands
    await client.slasher.register(client)

    // log ready info
    client.logger.log('info', 'Ready!')
});

// react on messages
client.on('messageCreate',async msg => await client.command_event.message_create(msg))

// react on interactions
client.on("interactionCreate", async interaction => {
    // react on slash commands
    if (interaction.isCommand()) await client.slash_event.interaction_create(interaction)

    // when a menu was chosen
    else if (interaction.isSelectMenu()) await client.menu_event.interaction_create(interaction)

    // when a button was pressed
    else if (interaction.isButton()) await client.button_event.interaction_create(interaction)
})
// ---------------------------------

// login to Discord with app's token
client.login(client.config.token)
