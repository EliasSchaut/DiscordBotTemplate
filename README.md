![GitHub package.json version](https://img.shields.io/github/package-json/v/EliasSchaut/Discord-Bot-Template?style=flat-square)
![NPM](https://img.shields.io/npm/l/@elias.schaut/discord-bot-template?style=flat-square)

# Discord.js-Template
A template for creating discord bots with node.js and discord.js \
This project was guided by [Discord.js Guide](https://discordjs.guide/)


## Features
* Easy create new commands with lots of precreated modifications (see [add a command](#add-a-command))
* Use precreated database or create new ones (see [database](#add-and-use-a-database))
* Add own languages or use the precreated english and german for responses in discord (see [add a language](#add-a-language))
* Customise bot in config file (see [Config File](#config-file))


## Preparations
* You need [node.js](https://nodejs.org/en/) installed (version 16.6.0 or newer).
* You need a [Discord API Bot](https://discord.com/developers/applications) with it's token.
* You need a [Discord Server](https://support.discord.com/hc/en-us/articles/204849977-How-do-I-create-a-server) in which you can set permissions and invite the API Bot.


## Set Up
1. Download the code
2. Rename the [configuration file](/config/config-template.json) from ```config-template.json``` to ```config.json```
3. Open the configuration file (now ```config.json```) and set values. The [Config-File-Table](#config-file) shows what can be set and how:
4. Optional: Configure [`package.json`](https://discordjs.guide/improving-dev-environment/package-json-scripts.html) 
5. Run `npm install`.

### Config File
| Key | Description | Value-Type | Need to set |
  --- |         --- |   --- |   ---
| prefix | The bot's prefix | String | yes |
| token | The bot's token | String | yes |
| enable_logging | When true, every console-output will log into a log file | Boolean | yes |
| log_file_name | The name of the log-file | String | Only when enable_logging is true |
| role_ids_admin | Users which have a corresponding role are admins and can execute admin_only command | `[ "<String>", ..., "<String>"]` | no |
| user_ids_admin | Users which have a corresponding id are admins and can execute admin_only command | `[ "<String>", ..., "<String>"]` | no |
| enable_activity | If true, the bot has use activity.status and activity.type to create a activity status `<type> <name>` (e.g. Playing help) | Boolean | have to be true, if status or type is set |
| activity.name | Name of the activity | String | no |
| activity.type | [Type](https://discord.com/developers/docs/topics/gateway#activity-object-activity-types) of the activity | String | no |
| help.show_only_permitted_commands | If true, the help command only lists the commands that the author can execute. WARNING: Be careful if help.send_to_dm is also true. This may cause problems because some permissions checks may based on guild checks which aren't available in the dms | Boolean | no |
| help.send_to_dm | If true, the help command sends the command list direct to the author (dm) | Boolean | no |
| embed.color | Color of embed messages. Use Hex or [Discord-Color](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable).  | String | no |
| embed.avatar_url | Url to avatar of embed messages | String | no |
| default_lang | The default language in which the bot responds (discord response only) | String + value must be a key in lang_paths | yes |
| enable_lang_change | If true the lang command is executable which allows users to change their personal language (language will only change for the specific user, not globally) | Boolean | yes |
| lang_paths | Another json object which holds all supported languages. The keys in the json are the language names and the values the source relative to lang folder | String | yes |


## Run
Run `index.js` with `node index.js` or `npm start`. \
Alternative you can use `npm run pm`, `npm run pm-restart` and `npm run pm-stop`. 
This will use [pm2](https://discordjs.guide/improving-dev-environment/pm2.html) for executing

## Add a command 
1. Create a new JS file with the name <command name>.js inside a folder in the folder `commands`. \
   **Note**: Every command has to be in a folder in the folder `commands`. A command, which is directly in the folder 
   `commands` or in a folder in a folder in `commands` is not allowed! But you can create own folders in `commands`.
2. Fill the newly created JS file with the [Command Skeleton](#command-skeleton) (\<something\> means you have to insert something here (without the \<\>)):
3. Fill in your [modifications](#command-modificators) and write your execution code.

### Command Skeleton
```js
module.exports = {
    name: '<name>',
    description: '<help>',
    aliases: ['<alias_1>', '<alias_2>'],
    args_needed: true,
    args_min_length: 2,
    usage: '<usage>',
    guild_only: true,
    dm_only: true,
    need_permission: ['<permission1>'],
    admin_only: true,
    nfsw: true,
    disabled: true,
    execute(msg, args) {  // msg = discord.js 'Message' object; args = given arguments as list
        // your lovely code to execute
    },
};
```

### Command Modificators
| Key | Description | Value-Type | Required |
  --- |         --- |   ---      |   ---
| name | The name of the command | String + should be also the name of the file | yes |
| description | The description of the command. It will be shown in help command | String | yes |
| aliases | Aliases for the command | `['<String>', ..., '<String>']` | no |
| args_needed | If true, the command will only execute, if at least one argument is given. If args_min_length is set, the command needs at least this number of argument | Boolean | only if args_min_length is set |
| args_min_length | The minimal number arguments, the command needs to be executed | Number | no |
| usage | The description, how the arguments must look like | String | only if args_needed is set |
| guild_only | If true the command runs only in guilds | Boolean | no |
| dm_only | If true the command runs only in dms | Boolean | no |
| need_permission | Users who want to execute the command need to have these permissions. | `['<Discord-Permission>, ..., <Discord-Permission>']` (see [Discord-Permissions](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)) | no |
| admin_only | If true, only admins (see [config file](#config-file)) can run this command | Boolean | no |
| nfsw | If true, the command runs only in nfsw channels | Boolean | no |
| disabled | If true, the command is not usable | Boolean | no |


## Add a language
1. Create a JSON file in folder [lang](/lang) and name is `text_<lang>.json`
2. Copy json from another language file and translate it
3. Edit lang_paths in [config file](#config-file)


## Add and use a database
1. Add a [sequelize model](https://discordjs.guide/sequelize/#alpha-connection-information) in folder [models](/db/models) in a new file (name file like database name)
2. Require the DB object from db_init
3. Database is usable with DB.<model_file_name> 
