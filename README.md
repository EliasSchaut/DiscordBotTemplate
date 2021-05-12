# Discord.js-Template
A template for creating discord bots with node.js and discord.js

## Preparations
* You need [node.js](https://nodejs.org/en/) and [discord.js](https://discord.js.org/#/) installed.
* You need a [Discord API Bot](https://discord.com/developers/applications) with it's token.
* You need a [Discord server](https://support.discord.com/hc/en-us/articles/204849977-How-do-I-create-a-server) on which you can set permissions, so you can invite the bot and give it permissions.

## Configuration
1. Rename the configuration file *(/config/config-template.json)* from ```config-template.json``` to ```config.json```
2. Open the configuration file (now ```config.json```) and set:
   * your bot's prefix
   * your bot's token
   * your admin id's: Enter a discord user id in quotation marks and separate several with a comma ```[ "<id>", "<id>", ..., "<id>"]```.\
     These are the only users who have the permission to execute the restricted commands.
   * OPTIONAL: change lang from "en" to "de" for german instead of english language 
