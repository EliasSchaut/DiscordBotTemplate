module.exports = {
    name: 'echo',
    description: 'Sends back your arguments.',
    aliases: ['echos'],
    args: true,
    usage: '[text]',
    args_min_length: 1,
    guildOnly: false,
    dmOnly: false,
    restricted: false,
    execute(message, args) {
        message.channel.send(`${args}`);
    },
};