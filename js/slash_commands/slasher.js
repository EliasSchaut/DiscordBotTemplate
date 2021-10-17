
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

        const slash_commands = await rest.put(
            Routes.applicationCommands(client.config.client_id),
            { body: await get_slash_commands(client) },
        )

        await client.application?.commands.permissions.set(get_permissions(client, slash_commands))

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
    const name = client.mod_getter.get_name(command)
    const description = await client.mod_getter.get_description(fake_msg, command)

    const data = new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .setDefaultPermission(client.mod_getter.get_admin_only(command) || client.mod_getter.get_need_permission(command))

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
    const name = client.mod_getter.get_name(command)
    const args_min_length = client.mod_getter.get_args_min_length(command)
    const args_max_length = client.mod_getter.get_args_max_length(command)

    if (fs.existsSync(`./js/slash_commands/option_models/${name}.js`)) {
        const option_model = require(`./option_models/${name}.js`)
        for (const option of option_model) {
            options.push(create_option(option.name, option.description, option.required, option.choices))
        }
        return options
    }

    if (client.config.auto_slash_options && args_min_length) {
        let i = 0
        for (i; i < args_min_length; i++) {
            options.push(create_option(`${i}`, `${i}`, true))
        }

        if (args_max_length) {
            for (let j = i; j < args_max_length; j++) {
                options.push(create_option(`${j}`, `${j}`, false))
            }
        }
        return options
    }
    return false
}

function create_option(name, description, required, choices) {
    return new SlashCommandStringOption()
        .setName(name)
        .setDescription(description)
        .setRequired(required)
        .addChoices(choices)
}
// ----------------------------


// ----------------------------
// Permissions
// ----------------------------
function get_permissions(client, slash_commands) {
    const full_permissions = []
    for (const slash_command of slash_commands) {
        const permissions = []
        const command = client.commands.get(slash_command.name)

        if (client.mod_getter.get_admin_only(command)) permissions.push.apply(permissions, get_permission_admin_only(client))

        if (permissions.length) {
            full_permissions.push({
                "id": slash_command.application_id,
                "permissions": permissions
            })
        }
    }

    return full_permissions
}

function get_permission_admin_only(client) {
    const permissions = []
    for (const user_id_admin of client.config.user_ids_admin) {
        permissions.push({
            "id": user_id_admin,
            "type": "USER",
            "permission": true
        })
    }

    for (const role_id_admin of client.config.role_ids_admin) {
        permissions.push({
            "id": role_id_admin,
            "type": "ROLE",
            "permission": true
        })
    }

    return permissions
}
// ----------------------------


// ----------------------------
// Checker
// ----------------------------
function check_slash(client, command) {
    return client.mod_getter.get_enable_slash(command)
}
// ----------------------------

module.exports = { register }
