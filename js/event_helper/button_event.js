
// ---------------------------------
// Export
// ---------------------------------
async function interaction_create(interaction) {
    if (!check_button(interaction)) return

    // add more specific button handlers here and below in Specific Button Handlers
}
// ---------------------------------



// ---------------------------------
// Specific Button Handlers
// ---------------------------------

// ---------------------------------



// ---------------------------------
// Checker
// ---------------------------------
function check_button(interaction) {
    return interaction.isButton()
}

function check_custom_id(interaction, custom_id) {
    return interaction.customId === custom_id
}
// ---------------------------------

module.exports = { interaction_create }
