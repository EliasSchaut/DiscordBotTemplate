module.exports = [
    {
        "name": "command",
        "description": "reload specific command",
        "required": true,
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