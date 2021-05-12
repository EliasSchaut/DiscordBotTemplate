module.exports = {
    name: 'ping',
    description: 'Get the bot\'s ping',
    aliases: ['p'],
    args: false,
    guildOnly: false,
    dmOnly: false,
    restricted: false,
    execute(message, args) {
        message.channel.send(`Websocket heartbeat: ${message.mentions.client.ws.ping}ms.`);

        message.channel.send('Pinging...').then(send => {
            send.edit(`Roundtrip latency: ${send.createdTimestamp - message.createdTimestamp}ms`);
        });
    },
};