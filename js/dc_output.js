const s = "error."

// ----------------------------
// Output
// ----------------------------
async function send(msg, content) {
    if (msg.type === 'APPLICATION_COMMAND') await send_slash(msg, content)
    else await send_cmd(msg, content)
}

async function reply(msg, content) {
    if (msg.type === 'APPLICATION_COMMAND') await send_slash(msg, content)
    else await reply_cmd(msg, content)
}

async function send_to_dm(msg, content) {
    if (msg.type === 'APPLICATION_COMMAND') await send_to_dm_slash(msg, content)
    else await send_to_dm_cmd(msg, content)
}

async function edit(msg_to_edit, new_content) {
    if (msg_to_edit.type === 'APPLICATION_COMMAND') await edit_slash(msg, new_content)
    else await edit_cmd(msg_to_edit, new_content)
}
// ----------------------------


// ----------------------------
// Errors
// ----------------------------
async function send_fail_admin_only(msg) {
    return reply(await msg.client.lang_helper.get_text(msg, `${s}restricted`))
}

async function send_fail_permissions(msg) {
    return reply(await msg.client.lang_helper.get_text(msg, `${s}restricted`))
}

async function send_fail_guild_only(msg) {
    return reply(await msg.client.lang_helper.get_text(msg, `${s}guild_only`))
}

async function send_fail_dm_only(msg) {
    return reply(await msg.client.lang_helper.get_text(msg, `${s}dm_only`))
}

async function send_fail_nsfw(msg) {
    return reply(await msg.client.lang_helper.get_text(msg, `${s}nsfw_only`))
}

async function send_fail_missing_args(msg, prefix, command) {
    let reply_content = `${await msg.client.lang_helper.get_text(msg, `${s}missing_args`)}, ${msg.author}`
    const usage = await msg.client.mod_getter.get_usage(msg, command)

    if (usage) {
        const name = msg.client.mod_getter.get_name(command)
        reply_content += `\n${(await msg.client.lang_helper.get_text(msg, `${s}missing_args_proper_use`))} \`${prefix}${name} ${usage}\``
    }

    return reply(reply_content)
}
// ----------------------------


// ----------------------------
// Output from command
// ----------------------------
async function send_cmd(msg, content) {
    await msg.channel.send(content)
}

async function reply_cmd(msg, content) {
    await msg.reply(content)
}

async function send_to_dm_cmd(msg, content) {
    await msg.author.send(content)
}

async function edit_cmd(msg, new_content) {
    await msg.edit(new_content)
}
// ----------------------------


// ----------------------------
// Output from slash
// ----------------------------
async function send_slash(interaction, content) {
    if (!interaction.replied) {
        await interaction.reply(content)

    } else {
        await interaction.followUp(content)
    }
}

async function send_to_dm_slash(interaction, content) {
    const user = interaction.client.users.cache.get(interaction.member.user.id);
    await user.send(content)
}

async function edit_slash(interaction, new_content) {
    await interaction.editReply(new_content)
}
// ----------------------------

module.exports = { send, reply, send_to_dm, edit,
    send_fail_admin_only, send_fail_permissions, send_fail_guild_only, send_fail_dm_only, send_fail_nsfw,
    send_fail_missing_args }
