const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`./config.json`))

exports.start = async(lol, name) => {
    text = `Hello ${name}! Im a multifunction bot build with ❤️ by  [my master](${config.ownerLink}).`
    await lol.replyWithMarkdown(text, { disable_web_page_preview: true })
}

exports.help = async(lol, name) => {
    text = `Hello ${name}! Here are the available commands you can use :`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Islami Menu', callback_data: 'islami' },
                    { text: 'Download Menu', callback_data: 'downloader' }
                ]
            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

exports.islami = async(lol) => {
    prefix = config.prefix
    text = `Islami Menu :

${prefix}listsurah
${prefix}alquran no_surah
${prefix}alquran no_surah/no_ayat
${prefix}alquran no_surah/no_ayat1-no_ayat2
${prefix}alquranaudio no_surah
${prefix}alquranaudio no_surah/no_ayat
${prefix}asmaulhusna
${prefix}kisahnabi
${prefix}jadwalsholat daerah
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help' }
                ]
            ]
        }
    })
}

exports.download = async(lol) => {
    prefix = config.prefix
    text = `Downloader Menu :

${prefix}ytplay query
${prefix}ytsearch query
${prefix}ytmp3 link
${prefix}ytmp4 link
${prefix}tiktoknowm link
${prefix}tiktokmusic link
${prefix}spotify link
${prefix}spotifysearch query
${prefix}jooxplay query
${prefix}zippyshare link
${prefix}pinterest query
${prefix}pinterestdl link
${prefix}pixiv query
${prefix}pixivdl pixiv_id
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help' }
                ]
            ]
        }
    })
}


exports.messageError = async(lol) => {
    await lol.reply(`Error! Please report to the [${config.owner}](${config.ownerLink}) about this`, { parse_mode: "Markdown", disable_web_page_preview: true })
}