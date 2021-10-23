// ----------------------------------
// Global values
// ----------------------------------
const fs = require("fs")
const mods_path = "./mods"
const mods = {}
// ----------------------------------


// ----------------------------------
// init/check
// ----------------------------------
function init(client) {
    const mod_folder = fs.readdirSync(mods_path)
    for (const mod_file of mod_folder) {
        const mod = require(`${mods_path}/${mod_file}`).filter(file => file.endsWith('.js'))
        mods[mod.name] = mod
    }

    client.mods = mods
}

async function check(msg, command, args) {

}
// ----------------------------------


// ----------------------------------
// valid
// ----------------------------------
function check_all_valid(client) {

}

function send_invalid(client, command, mod_name, mod_type, mod_required) {

}
// ----------------------------------

module.exports = { init, check_all_valid, send_invalid }
