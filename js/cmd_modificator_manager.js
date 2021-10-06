
// ----------------------------
// Getter
// ----------------------------
function get_name(command) {
    return (has_name(command)) ? command.name : null
}

async function get_description(msg, command) {
    return (await has_description(command)) ? await command.description(msg) : null
}

function get_aliases(command) {
    return (has_aliases(command)) ? command.aliases : null
}

function get_args_needed(command) {
    return (has_args_needed(command)) ? command.args_needed : null
}

function get_args_min_length(command) {
    return (has_args_min_length(command)) ? command.args_min_length : null
}

function get_args_max_length(command) {
    return (has_args_max_length(command)) ? command.args_max_length : null
}

async function get_usage(msg, command) {
    return (has_usage(command)) ? await command.usage(msg) : null
}

function get_guild_only(command) {
    return (has_guild_only(command)) ? command.guild_only : null
}

function get_dm_only(command) {
    return (has_dm_only(command)) ? command.dm_only : null
}

function get_need_permission(command) {
    return (has_need_permission(command)) ? command.need_permission : null
}

function get_nsfw(command) {
    return (has_nsfw(command)) ? command.nsfw : null
}

function get_disabled(command) {
    return (has_disabled(command)) ? command.disabled : null
}
// ----------------------------



// ----------------------------
// Checker
// ----------------------------
function has_name(command) {
    return command.hasOwnProperty("name")
}

function has_description(command) {
    return command.hasOwnProperty("description")
}

function has_aliases(command) {
    return command.hasOwnProperty("aliases")
}

function has_args_needed(command) {
    return command.hasOwnProperty("args_needed")
}

function has_args_min_length(command) {
    return command.hasOwnProperty("args_min_length")
}

function has_args_max_length(command) {
    return command.hasOwnProperty("args_max_length")
}

function has_usage(command) {
    return command.hasOwnProperty("usage")
}

function has_guild_only(command) {
    return command.hasOwnProperty("guild_only")
}

function has_dm_only(command) {
    return command.hasOwnProperty("dm_only")
}

function has_need_permission(command) {
    return command.hasOwnProperty("need_permission")
}

function has_nsfw(command) {
    return command.hasOwnProperty("nsfw")
}

function has_disabled(command) {
    return command.hasOwnProperty("disabled")
}
// ----------------------------
