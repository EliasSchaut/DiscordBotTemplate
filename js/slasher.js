
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// ----------------------------
// Export
// ----------------------------
async function register(client) {
    const rest = new REST({ version: '9' }).setToken(client.config.token)

    try {
        client.logger.log("info", 'Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.config.client_id),
            { body: await get_slash_commands(client) },
        );

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
        if (check_slash(client, command[1])) slash_commands.push(await create_slash_command(client, command[1]))
    }

    return slash_commands.map(command => command.toJSON());
}

async function create_slash_command(client, command) {
    const fake_msg = {author: {id: "-1", username: "slash_command"}, client: client}

    const data = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(await command.description(fake_msg))

    const option = create_options(client, command)
    if (option) data.addStringOption(await option)

    return data
}

async function create_options(client, command) {
    const option = new SlashCommandStringOption()

    if (command.args_max_length) {

    }

    return option
}
// ----------------------------


// ----------------------------
// Checker
// ----------------------------
function check_slash(client, command) {
    return command.hasOwnProperty("enable_slash") && command.enable_slash
}
// ----------------------------

module.exports = { register }
