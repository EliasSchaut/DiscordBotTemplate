const config = require("../config/config.json")


let command_tree = []

function from_guild(message) {
    return message.channel.type === 'dm'
}

function from_dm(message) {
    return message.channel.type !== 'dm'
}

function check_args(command, args) {
    return args.length >= command.args_min_length
}

function is_permitted(user_id) {
    return config.admin_ids.includes(user_id)
}



module.exports = { command_tree, from_guild, from_dm, check_args , is_permitted }