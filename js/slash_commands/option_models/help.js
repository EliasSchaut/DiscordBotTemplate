module.exports = [
    {
        "name": "command",
        "description": "information for the specific command",
        "required": false,
        "choices": [
            { "name": "help", "value": "help" },
            { "name": "reload", "value": "reload" },
            { "name": "lang", "value": "lang" },
            { "name": "prefix", "value": "prefix" },
            { "name": "echo", "value": "echo" },
            { "name": "ping", "value": "ping" },
        ]
    }
]