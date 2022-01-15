// See also: https://github.com/EliasSchaut/Discord-Bot-Template/wiki/How-to-database
// Sequelize-Types: https://sequelize.org/v5/manual/data-types.html
// Examples: https://discordjs.guide/sequelize/

// ---------------------------------------------
// Model
// ---------------------------------------------
const _TABLE = (sequelize, Sequelize) => {
    return sequelize.define('<NAME>', {
        "<attribute1>": {
            type: "<Sequelize-Type>",
            unique: true,
        },
        "<attribute2>": "<Sequelize-Type>",
    }, {
        timestamp: false
    })
}
// ---------------------------------------------


// ---------------------------------------------
// Helper
// ---------------------------------------------
// add stuff to database
async function add(msg) {
    try {
        await msg.client.DB["<NAME>"].TABLE.create({
            "<attribute1>": "<value1>",
            "<attribute2>": "<value2>"
        })

    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            msg.client.logger.log("warn",`<value> already exist in database!`)

        } else {
            msg.client.logger.log("error",`Something went wrong with adding this <values> in database!`)
        }
    }
}

// get stuff from database
async function get(msg) {
    const tag = await msg.client.DB["<NAME>"].TABLE.findOne({ where: { "<attribute1>": "<value1>" } })

    if (tag) {
        return tag.lang

    } else {
        msg.client.logger.log("warn",`<value> not in database!`)
        await add(msg)
        return await get(msg)
    }
}


// set stuff in database
async function set(msg) {
    const new_tag = await msg.client.DB["<NAME>"].TABLE.update({ "<attribute2>": "<value3>" }, { where: { "<attribute1>": "<value1>" } })

    if (new_tag) {
        return true

    } else {
        msg.client.logger.log("error", `Could not set <attribute2>!`)
        return false
    }
}

// remove tag in database
async function remove(msg) {
    const rowCount = await msg.client.DB["<NAME>"].TABLE.destroy({ where: { "<attribute1>": "<value1>" } })

    if (rowCount) {
        return true

    } else {
        msg.client.logger.log("error", `Could not delete tag with <attribute1>!`)
        return false
    }
}
// ---------------------------------------------


module.exports = { _TABLE, add, get, set, remove }
