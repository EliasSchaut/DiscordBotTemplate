// ===============================
// This file provides different useful methods about languages
// ===============================

const { lang_paths } = require("../../config/config.json")

// get all language files and save it into text
const text = {}
for (const lang in lang_paths) {
    text[lang] = require(`./${lang_paths[lang]}`)
}

// checks if the given lang has a lang_file (is supported)
function is_valid(lang) {
    return text.hasOwnProperty(lang)
}

// returns text in the correct language (key = json key with its scope (e.g. commands.echo.help))
async function get_text(msg, key, ...inserts) {
    const lang = (msg.client.config.enable_lang_change) ? await msg.client.DB.User_Lang.get(msg) : msg.client.config.default_lang
    const key_arr = key.split(".")

    let scope_text = text[lang]
    for (const element of key_arr) {
        if (scope_text.hasOwnProperty(element)) {
            scope_text = scope_text[element]

        } else {
            msg.client.logger.log('error', `Text-Key ${key} dont exist for lang ${lang}!`)
            return "??"
        }
    }

    return (inserts.length) ? set_inserts(msg, scope_text, ...inserts) : scope_text
}

// replaces %<index> with actual text from ...inserts
function set_inserts(msg, text, ...inserts) {
    for (let i = 0; i < inserts.length; i++) {
        const regEx = new RegExp(`%${i}([^0-9]|$)`,"g")
        const index = text.search(regEx)

        if (index === -1) {
            msg.client.logger.log('error', `Can't find gap-index %${i} in lang_text:\n${text}`)

        } else {
            text = text.substring(0, index) + `${inserts[i]}` + text.substring(index + `%${i}`.length, text.length)
        }
    }

    return text
}

module.exports = { text, is_valid, get_text }
