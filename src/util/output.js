
// ----------------------------
// Output
// ----------------------------
async function send(msg, content) {
    if (check_slash(msg)) return await send_slash(msg, content)
    else return await send_cmd(msg, content)
}

async function reply(msg, content) {
    if (check_slash(msg)) return await send_slash(msg, content)
    else return await reply_cmd(msg, content)
}

async function send_to_dm(msg, content) {
    if (check_slash(msg)) return await send_to_dm_slash(msg, content)
    else return await send_to_dm_cmd(msg, content)
}

async function edit(msg_to_edit, new_content) {
    if (check_slash(msg_to_edit)) return await edit_slash(msg_to_edit, new_content)
    else return await edit_cmd(msg_to_edit, new_content)
}
// ----------------------------



// ----------------------------
// Check Slash
// ----------------------------
function check_slash(msg) {
    return ((msg.type === 'APPLICATION_COMMAND') && (!Object.keys(msg).includes("interaction"))) || (msg.type === 'MESSAGE_COMPONENT')
}
// ----------------------------


// ----------------------------
// Output from command
// ----------------------------
async function send_cmd(msg, content) {
    return await msg.channel.send(content)
}

async function reply_cmd(msg, content) {
    return await msg.reply(content)
}

async function send_to_dm_cmd(msg, content) {
    return await msg.author.send(content)
}

async function edit_cmd(new_msg, new_content) {
    return await new_msg.edit(new_content)
}
// ----------------------------


// ----------------------------
// Output from slash
// ----------------------------
async function send_slash(interaction, content) {
    if (!interaction.replied) {
        return await interaction.reply(content)

    } else {
        return await interaction.followUp(content)
    }
}

async function send_to_dm_slash(interaction, content) {
    const user = interaction.client.users.cache.get(interaction.member.user.id);
    return await user.send(content)
}

async function edit_slash(interaction, new_content) {
    return await interaction.editReply(new_content)
}
// ----------------------------

module.exports = { send, reply, send_to_dm, edit }
