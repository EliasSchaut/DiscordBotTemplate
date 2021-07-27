# Discord.js-Template
A template for creating discord bots with node.js and discord.js \
NOTE: This README.md is outdated. Better docu is in progress.

## Preparations
* You need [node.js](https://nodejs.org/en/) installed.
* You need a [Discord API Bot](https://discord.com/developers/applications) with it's token.
* You need a [Discord server](https://support.discord.com/hc/en-us/articles/204849977-How-do-I-create-a-server) on which you can set permissions, so you can invite the bot and give it permissions.

## Configuration
1. Download the code
2. Rename the configuration file *(/config/config-template.json)* from ```config-template.json``` to ```config.json```
3. Open the configuration file (now ```config.json```) and set:
   * your bot's prefix
   * your bot's token
   * your admin id's: Enter a discord user id in quotation marks and separate several with a comma ```[ "<id>", "<id>", ..., "<id>"]```.\
     These are the only users who have the permission to execute the restricted commands
   * OPTIONAL: change lang from "en" to "de" for german instead of english language
   * OPTIONAL: change the name or place of the commands directory by editing the file path `commands_path`
4. Run `npm install`.

## Add a command 
1. Create a new JS file with the name [command name].js inside a folder in the folder `commands`.\
   **Note**: Every command has to be in a folder in the folder `commands`. A command, which is directly in the folder 
   `commands` or in a folder in a folder in `commands` is not allowed!
2. Write down the following skeleton (\<something\> means you have to insert something here): 
```js
module.exports = {
    name: '<name>',                         // REQUIRED: insert the name of the command
    description: '<help>',                  // REQUIRED: describe your command
    aliases: ['<alias_1>', '<alias_2>'],    // OPTIONAL: make optional aliases
    args_needed: true,                      // OPTIONAL: user must enter arguments
    args_min_length: 2,                     // ONLY WHEN args_needed: user must enter a minumum of this number arguments
    usage: '<usage>',                       // ONLY WHEN args_needed: how the arguments must look like
    guild_only: true,                       // OPTIONAL: this command runs only in guilds
    dm_only: true,                          // OPTIONAL: this command runs only in dms
    need_permission: ['<permission1>'],     // OPTIONAL: only members with this permissions can execute this command (See also: https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
    admin_only: true,                       // OPTIONAL: only admins (see config file) can run this command 
    disabled: true,                         // OPTIONAL: if disabled, the command is not useable
    execute(message, args) {                // message = discord.js 'Message' object; args = given arguments as list
        // your lovely code to execute
    },
};
```
3. Fill in your modifications and write your execution code.

## Run
Run `index.js` with `node index.js` or config your generated `package.json`.



   
