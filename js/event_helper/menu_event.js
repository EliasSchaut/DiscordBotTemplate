
// ---------------------------------
// Export
// ---------------------------------
async function interaction_create(interaction) {
    if (!check_menu(interaction)) return

    if (check_custom_id(interaction, "help")) await help_menu(interaction)
    // add more specific menu handlers here and below in Specific Menu Handlers
}
// ---------------------------------



// ---------------------------------
// Specific Menu Handlers
// ---------------------------------
async function help_menu(interaction) {
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
// ---------------------------------



// ---------------------------------
// Checker
// ---------------------------------
function check_menu(interaction) {
    return interaction.isSelectMenu()
}

function check_custom_id(interaction, custom_id) {
    return interaction.customId === custom_id
}
// ---------------------------------

module.exports = { interaction_create }
