// ----------------------------------
// Global values
// ----------------------------------
const fs = require("fs")
const mods_path_global = "./js/cmd_modificators/mods"
const mods_path = "./mods"
const mods = {}
// ----------------------------------


// ----------------------------------
// init/check
// ----------------------------------
function init(client) {
    const mod_folder = fs.readdirSync(mods_path_global)
    for (const mod_file of mod_folder) {
        const mod = require(`${mods_path}/${mod_file}`)
        mods[mod.name] = mod
    }

    client.mods = mods

    return check_all_valid(client)
}

async function check_all_mods(msg, command, args) {
    for (const mod of Object.keys(command)) {
        if (mod === "execute") continue
        else if (!(mod in mods)) {
            unknown(msg.client, command, mod)

        } else if (!await mods[mod].check(msg, command, args)) {
            await mods[mod].send_check_fail(msg, command, args)
            return false
        }
    }

    return true
}
// ----------------------------------


// ----------------------------------
// valid
// ----------------------------------
function check_all_valid(client) {
    for (const command of client.commands) {
        for (const mod of Object.keys(command[1])) {
            if (mod === "execute") continue
            else if (!(mod in mods)) {
                unknown(client, command[1], mod)

            } else if (!mods[mod].is_valid(command[1])) {
                send_invalid(client, command[1].name, mods[mod].name, mods[mod].type, mods[mod].required)
                return false
            }
        }
    }

    return true
}

function send_invalid(client, command_name, mod_name, mod_type, mod_required) {
    client.logger.log("error", `The command modification ${mod_name} of the command ${command_name} is invalid. 
    Check the modification name (${mod_name}), the type (${mod_type}) and whether it must be used (${mod_required})`)
}

function unknown(client, command_name, mod_name) {
    client.logger.log("warn", `The command modification ${mod_name} of the command ${command_name} is not known by the mod_manager.`)
}
// ----------------------------------

module.exports = { init, check_all_mods }
