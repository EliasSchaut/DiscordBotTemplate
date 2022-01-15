const config = require('../../../../config/config.json')
const choices = []
for (const lang of Object.keys(config.lang_paths)) {
    choices.push({ "name": lang, "value": lang })
}

module.exports = [
    {
        "name": "language",
        "description": "change into given language",
        "required": false,
        "choices": choices
    }
]