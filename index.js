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
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// create client with its intents
const client = new Discord.Client({ intents: [
        Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
        partials: ['CHANNEL']})

// get required methods and fields and save it into client. This will always be accessible with message.client
client.commands = new Discord.Collection()
client.config = require('./config/config.json')
client.helper = require('./js/command_helper')
client.lang_helper = require("./lang/lang_helper")
client.db_helper = require('./db/db_helper')
client.DB = require('./db/db_init').DB
client.sequelize = require('./db/db_init').sequelize
client.logger = require("./js/logger").logger
client.message_create = require("./js/event_helper/command_event").message_create

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
        await client.user.setActivity(client.config.activity.name, { type: client.config.activity.type })
    }

    // sync database
    await client.sequelize.sync()

    // log ready info
    client.logger.log('info', 'Ready!')
});

// react on messages
client.on('messageCreate', async msg => await client.message_create(msg))

// when a discord-menu was chosen
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isSelectMenu()) return;

    // when select menu for help command was chosen
    if (interaction.customId === "help") {
        const menu_msg = interaction.message
        const val = interaction.values[0]
        const clicker_msg = menu_msg
        clicker_msg.author = interaction.user

        if (val === 'all') {
            await interaction.update({ embeds: [await menu_msg.client.commands.get("help").create_embed_all_commands(clicker_msg)],
                components: [await menu_msg.client.commands.get("help").create_command_menu(clicker_msg)]})

        } else {
            await interaction.update({ embeds: [await menu_msg.client.commands.get("help").create_embed_specific_command(clicker_msg, menu_msg.client.commands.get(val))],
                components: [await menu_msg.client.commands.get("help").create_command_menu(clicker_msg)]})
        }
    }

    // add menu code here

})

// when a discord-button was pressed
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    // add button code here

})
// ---------------------------------

// login to Discord with app's token
client.login(client.config.token)
