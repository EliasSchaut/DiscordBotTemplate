
// ----------------------------
// Getter
// ----------------------------
function get_name(command) {
    return (has_name(command) && (typeof command.name === "string")) ? command.name : false
}

async function get_description(msg, command) {
    if (has_description(command)) {
        const description = await command.description(msg)
        return (typeof description === "string") ? description : false
    }
    return false
}

function get_aliases(command) {
    return (has_aliases(command) && (typeof command.aliases === "object")) ? command.aliases : false
}

function get_args_needed(command) {
    return (has_args_needed(command) && (typeof command.args_needed === "boolean")) ? command.args_needed : false
}

function get_args_min_length(command) {
    return (has_args_min_length(command) && (typeof command.args_min_length === "number")) ? command.args_min_length : false
}

function get_args_max_length(command) {
    return (has_args_max_length(command) && (typeof command.args_max_length === "number")) ? command.args_max_length : false
}

async function get_usage(msg, command) {
    if (has_usage(command)) {
        const usage = await command.usage(msg)
        return (typeof usage === "string") ? usage : false
    }
    return false
}

function get_guild_only(command) {
    return (has_guild_only(command) && (typeof command.guild_only === "boolean")) ? command.guild_only : false
}

function get_dm_only(command) {
    return (has_dm_only(command) && (typeof command.dm_only === "boolean")) ? command.dm_only : false
}

function get_need_permission(command) {
    return (has_need_permission(command) && (typeof command.need_permission === "object")) ? command.need_permission : false
}

function get_admin_only(command) {
    return (has_admin_only(command) && (typeof command.admin_only === "boolean")) ? command.admin_only : false
}

function get_nsfw(command) {
    return (has_nsfw(command) && (typeof command.nsfw === "boolean")) ? command.nsfw : false
}

function get_disabled(command) {
    return (has_disabled(command) && (typeof command.disabled === "boolean")) ? command.disabled : false
}

function get_enable_slash(command) {
    return (has_enable_slash(command) && (typeof command.enable_slash === "boolean")) ? command.enable_slash : false
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

function has_admin_only(command) {
    return command.hasOwnProperty("admin_only")
}

function has_nsfw(command) {
    return command.hasOwnProperty("nsfw")
}

function has_disabled(command) {
    return command.hasOwnProperty("disabled")
}

function has_enable_slash(command) {
    return command.hasOwnProperty("enable_slash")
}
// ----------------------------

module.exports = { get_name, get_description, get_aliases, get_args_needed, get_args_min_length, get_args_max_length,
    get_usage, get_guild_only, get_dm_only, get_need_permission, get_admin_only, get_nsfw, get_disabled, get_enable_slash }
