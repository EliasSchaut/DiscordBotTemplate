
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require("fs")

// ----------------------------
// Export
// ----------------------------
async function register(client) {
    const rest = new REST({ version: '9' }).setToken(client.config.token)

    try {
        client.logger.log("info", 'Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.config.client_id),
            { body: client.config.enable_slash_commands ? await get_slash_commands(client) : [] },
        )

        client.logger.log("info", 'Successfully reloaded application (/) commands.');
    } catch (error) {
        client.logger.log("error", error);
    }
}
// ----------------------------


// ----------------------------
// Helper
// ----------------------------
async function get_slash_commands(client) {
    const slash_commands = []

    for (const command of client.commands) {
        if (await check_slash(client, command[1])) slash_commands.push(await create_slash_command(client, command[1]))
    }

    return slash_commands.map(command => command.toJSON());
}

async function create_slash_command(client, command) {
    const fake_msg = {author: {id: "-1", username: "slash_command"}, client: client}
    const name = await client.mods.name.get(null, command)
    const description = await client.mods.description.get(fake_msg, command)

    const data = new SlashCommandBuilder()
        .setName(name)
        .setDescription(client.helper.trim_text(description, 100, true))

    const options = await create_options(client, command)
    if (options.length) {
        for (const option of options) {
            data.addStringOption(await option)
        }
    }

    return data
}

async function create_options(client, command) {
    const options = []
    const name = await client.mods.name.get(null, command)
    const args_min_length = await client.mods.args_min_length.get(null, command)
    const args_max_length = await client.mods.args_max_length.get(null, command)

    if (fs.existsSync(`./src/handler/slash_handler/option_models/${name}.js`)) {
        const option_model = require(`./option_models/${name}.js`)
        for (const option of option_model) {
            options.push(create_option(option.name, option.description, option.required, option.choices))
        }
        return options
    }

    if (client.config.auto_slash_options && args_min_length) {
        let i = 0
        for (i; i < args_min_length; i++) {
            options.push(create_option(`${i}`, `${i}`, true, []))
        }

        if (args_max_length) {
            for (let j = i; j < args_max_length; j++) {
                options.push(create_option(`${j}`, `${j}`, false, []))
            }
        }
        return options
    }
    return false
}

function create_option(name, description, required, choices) {
    const option = new SlashCommandStringOption()
        .setName(name)
        .setDescription(description)
        .setRequired(required)

    for (const choice of choices) {
        option.addChoice(choice.name, choice.value)
    }

    return option
}
// ----------------------------


// ----------------------------
// Checker
// ----------------------------
async function check_slash(client, command) {
    return await client.mods.enable_slash.get(null, command)
}
// ----------------------------

module.exports = { register }
