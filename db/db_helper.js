const { User_Lang } = require("./db_init")
const { default_lang } = require("../config/config.json")

async function add_user_lang(message) {
    console.log("try to add user:" + message.author.id)

    try {
        const tag = await User_Lang.create({
            user_id: message.author.id,
            lang: default_lang
        })
        console.log(`Tag ${tag.user_id} added.`);

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            console.log('That tag already exists.');

        } else {
            console.log('Something went wrong with adding a tag.');
        }
    }
}

async function get_lang(message) {
    const tag = await User_Lang.findOne({ where: { user_id: message.author.id } });

    if (tag) {
        return tag.lang

    } else {
        console.log(`${message.author.id} not in database`)
        await add_user_lang(User_Lang, message)
        await get_lang(User_Lang, message)
    }
}

async function set_lang(message, to_set) {
    const tag = await User_Lang.update({ lang: to_set }, { where: { user_id: message.author.id } });

    if (tag) {
        return message.channel.send("Lang changed to: " + to_set);

    } else {
        console.log(`Could not get lang of ${message.author.id} in database User_Lang (set_lang)`)
        return message.reply(`Could not get lang of ${message.author.id}`);
    }
}

module.exports = { add_user: add_user_lang, get_lang, set_lang }