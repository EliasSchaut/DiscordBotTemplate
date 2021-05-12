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
     These are the only users who have the permission to execute the restricted commands
   * OPTIONAL: change lang from "en" to "de" for german instead of english language
   * OPTIONAL: change the name or place of the commands directory by editing the file path `commands_path`
3. Run `npm install`.

## Adding a command 
1. Create a new JS file with the name [command name].js inside a folder in the folder `commands`.\
   **Note**: Every command has to be in a folder in the folder `commands`. A command, which is directly in the folder 
   `commands` or in a folder in a folder in `commands` is not allowed!
2. Write down the following skeleton (\<something\> means you have to insert something here): 
```js
module.exports = {
    name: '<name>',                         // insert the name of the command
    description: '<help>',                  // describe your command
    aliases: ['<alias_1>', '<alias_2>'],    // make optional aliases
    args: false,                            // user must enter arguments
    args_min_length: 0,                     // user must enter a minumum of this number arguments
    usage: '<usage>',                       // how the arguments must look like
    guildOnly: false,                       // this command runs only in guilds
    dmOnly: false,                          // this command runs only in dms
    restricted: false,                      // only admins (see config file) can run this command 
    execute(message, args) {                // message = discord.js 'Message' object; args = given arguments as list
        // your code to execute
    },
};
```
3. Fill in your modifications and write your execution code.

## Run
Run `index.js` with `node index.js` or config your generated `package.json`.



   
