const fs = require('fs')
const { fetchJson } = require('./function')
const config = JSON.parse(fs.readFileSync(`./config.json`))
const bot = require('../index').bot

exports.getArgs = async(ctx) => {
    try {
        args = ctx.message.text
        args = args.split(" ")
        args.shift()
        return args
    } catch {
        return []
    }
}

exports.getUser = async(ctx) => {
    try {
        user = ctx.message.from
        last_name = user["last_name"] || ""
        full_name = user.first_name + " " + last_name
        user["full_name"] = full_name.trim()
        return user
    } catch {
        try {
            user = ctx.update.callback_query.from
            last_name = user["last_name"] || ""
            full_name = user.first_name + " " + last_name
            user["full_name"] = full_name.trim()
            return user
        } catch {
            return {}
        }
    }
}

exports.getBot = async(ctx) => {
    try {
        bot = ctx.botInfo
        last_name = bot["last_name"] || ""
        full_name = bot.first_name + " " + last_name
        bot["full_name"] = full_name.trim()
        return bot
    } catch (e) {
        return {}
    }
}

exports.getLink = async(file_id) => {
    try {
        bot_token = config.bot_token
        url_image = `https://api.telegram.org/bot${bot_token}/getFile?file_id=${file_id}`
        url_image = await fetchJson(url_image)
        file_path = url_image.result.file_path
        url_image = `https://api.telegram.org/file/bot${bot_token}/${file_path}`
        return url_image
    } catch {
        throw "Error while get url"
    }
}