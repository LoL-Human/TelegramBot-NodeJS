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
    } catch (e) {
        return {}
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