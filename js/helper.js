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

function permitted_commands_to_string(command_tree, user_id) {
    let out = ""
    Object.keys(command_tree).forEach(function (command_dir) {
        let data = []

        Object.keys(command_tree[command_dir]).forEach(function (command) {
            if (!((command_tree[command_dir][command].restricted && !is_permitted(user_id)))) {
                data.push(command)
            }
        })

        if (data) {
            out += `\n**${command_dir.toUpperCase()}**\n${data.join("\n")}\n`
        }
    })

    return out
}



module.exports = { command_tree, from_guild, from_dm, check_args , is_permitted, permitted_commands_to_string}