// ---------------------------------
// Export
// ---------------------------------
async function interaction_create(interaction) {
    interaction = interaction_to_message(interaction)

    // add more specific menu handlers here and below in Specific Menu Handlers
    const [command_name, args] = get_command_name_and_args(interaction)
    const command = get_command(interaction, command_name)

    if (await interaction.client.mod_man.check_all_mods(interaction, command, args)) {
        await interaction.client.command_event.try_to_execute(interaction, command, args)
    }
}
// ---------------------------------



// ---------------------------------
// Specific Slash Handlers
// ---------------------------------
function interaction_to_message(interaction) {
    interaction.author = interaction.user
    return interaction
}
// ---------------------------------


// ---------------------------------
// Getter
// ---------------------------------
function get_command_name_and_args(interaction) {
    const command_name = interaction.commandName.toLowerCase()
    let args = []
    for (const option of interaction.options.data) {
        args.push(option.value)
    }

    return [command_name, args]
}

function get_command(interaction, command_name) {
    return interaction.client.commands.get(command_name)
        || interaction.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name))
}
// ---------------------------------


// ---------------------------------
// Checker
// ---------------------------------

// ---------------------------------


// ----------------------------------
// Execute
// ----------------------------------

// ----------------------------------

module.exports = { interaction_create, interaction_to_message }
