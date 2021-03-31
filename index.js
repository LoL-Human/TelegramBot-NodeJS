const { fetchJson, range } = require('./lib/function')
const { Telegraf } = require('telegraf')
const help = require('./lib/help')
const tele = require('./lib/tele')
const clc = require('chalk');
const os = require('os')
const fs = require('fs')

const {
    apikey,
    bot_token,
    owner,
    ownerLink,
    version,
    prefix
} = JSON.parse(fs.readFileSync(`./config.json`))

const bot = new Telegraf(bot_token)

bot.command('start', async(lol) => {
    user = await tele.getUser(lol)
    await help.start(lol, user.full_name)
})

bot.command('help', async(lol) => {
    user = await tele.getUser(lol)
    await help.help(lol, user.full_name)
})

bot.on("callback_query", async(lol) => {
    callback_data = lol.callbackQuery.data
    user = await tele.getUser(lol)
    switch (callback_data) {
        case 'islami':
            await help.islami(lol)
            break
        case 'downloader':
            await help.download(lol)
            break
        case 'help':
        default:
            await help.help(lol, user.full_name)
            break
    }
})

bot.on("message", async(lol) => {
    try {
        const body = lol.message.text || lol.message.caption || ""

        comm = body.trim().split(" ").shift().toLowerCase()
        if (prefix != "" && body.startsWith(prefix)) {
            comm = body.slice(1).trim().split(" ").shift().toLowerCase()
        }
        const command = comm
        const args = await tele.getArgs(lol)

        const reply = async(text) => {
            for (var x of range(0, text.length, 4096)) {
                await lol.replyWithMarkdown(text.substr(x, 4096))
            }
        }

        const isGroup = lol.chat.type.includes("group")

        const quotedMessage = lol.message.reply_to_message || {}
        const isQuotedImage = quotedMessage.photo ? true : false
        const isQuotedVideo = quotedMessage.video ? true : false
        const isQuotedSticker = quotedMessage.sticker ? true : false
        const isQuotedDocument = quotedMessage.document ? true : false
        const isQuotedAnimation = quotedMessage.animation ? true : false

        switch (command) {
            case 'help':
                user = await tele.getUser(lol)
                await help.help(lol, user.full_name)
                break
                // Islami //
            case 'listsurah':
                result = await fetchJson(`http://api.lolhuman.xyz/api/quran?apikey=${apikey}`)
                result = result.result
                text = 'List Surah:\n'
                for (var x in result) {
                    text += `${x}. ${result[x]}\n`
                }
                await reply(text)
                break
            case 'alquran':
                if (args.length < 1) return reply(`Example: ${prefix + command} 18 or ${prefix + command} 18/10 or ${prefix + command} 18/1-10`)
                urls = `http://api.lolhuman.xyz/api/quran/${args[0]}?apikey=${apikey}`
                quran = await fetchJson(urls)
                result = quran.result
                ayat = result.ayat
                text = `QS. ${result.surah} : 1-${ayat.length}\n\n`
                for (var x of ayat) {
                    arab = x.arab
                    nomor = x.ayat
                    latin = x.latin
                    indo = x.indonesia
                    text += `${arab}\n${nomor}. ${latin}\n${indo}\n\n`
                }
                text = text.replace(/<u>/g, "").replace(/<\/u>/g, "")
                text = text.replace(/<strong>/g, "").replace(/<\/strong>/g, "")
                text = text.replace(/<u>/g, "").replace(/<\/u>/g, "")
                await reply(text)
                break
            case 'alquranaudio':
                if (args.length == 0) return reply(`Example: ${prefix + command} 18 or ${prefix + command} 18/10`)
                surah = args[0]
                await lol.replyWithAudio({ url: `http://api.lolhuman.xyz/api/quran/audio/${surah}?apikey=${apikey}` })
                break
            case 'asmaulhusna':
                result = await fetchJson(`http://api.lolhuman.xyz/api/asmaulhusna?apikey=${apikey}`)
                result = result.result
                text = `\`No        :\` *${result.index}*\n`
                text += `\`Latin     :\` *${result.latin}*\n`
                text += `\`Arab      :\` *${result.ar}*\n`
                text += `\`Indonesia :\` *${result.id}*\n`
                text += `\`English   :\` *${result.en}*`
                await reply(text)
                break
            case 'kisahnabi':
                if (args.length == 0) return reply(`Example: ${prefix + command} Muhammad`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/kisahnabi/${query}?apikey=${apikey}`)
                result = result.result
                text = `\`Name   :\` ${result.name}\n`
                text += `\`Lahir  :\` ${result.thn_kelahiran}\n`
                text += `\`Umur   :\` ${result.age}\n`
                text += `\`Tempat :\` ${result.place}\n`
                text += `\`Story  :\`\n${result.story}`
                await reply(text)
                break
            case 'jadwalsholat':
                if (args.length == 0) return reply(`Example: ${prefix + command} Yogyakarta`)
                daerah = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/sholat/${daerah}?apikey=${apikey}`)
                result = result.result
                text = `\`Wilayah :\` *${result.wilayah}*\n`
                text += `\`Tanggal :\` *${result.tanggal}*\n`
                text += `\`Sahur   :\` *${result.sahur}*\n`
                text += `\`Imsak   :\` *${result.imsak}*\n`
                text += `\`Subuh   :\` *${result.subuh}*\n`
                text += `\`Terbit  :\` *${result.terbit}*\n`
                text += `\`Dhuha   :\` *${result.dhuha}*\n`
                text += `\`Dzuhur  :\` *${result.dzuhur}*\n`
                text += `\`Ashar   :\` *${result.ashar}*\n`
                text += `\`Maghrib :\` *${result.imsak}*\n`
                text += `\`Isya    :\` *${result.isya}*`
                await reply(text)
                break

                // Downloader //
            case 'ytplay':
                if (args.length == 0) return reply(`Example: ${prefix + command} Melukis Senja`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/ytplay2?apikey=${apikey}&query=${query}`)
                result = result.result
                await lol.replyWithPhoto(result.thumbnail, { caption: result.title })
                break
            case 'ytsearch':
                if (args.length == 0) return reply(`Example: ${prefix + command} Melukis Senja`)
                try {
                    query = args.join(" ")
                    result = await fetchJson(`http://api.lolhuman.xyz/api/ytsearch?apikey=${apikey}&query=${query}`)
                    hasil = result.result.slice(0, 3)
                    hasil.forEach(async(res) => {
                        caption = `\`❖ Title     :\` *${res.title}*\n`
                        caption += `\`❖ Link      :\`* https://www.youtube.com/watch?v=${res.videoId} *\n`
                        caption += `\`❖ Published :\` *${res.published}*\n`
                        caption += `\`❖ Views    :\` *${res.views}*\n`
                        await lol.replyWithPhoto({ url: res.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                    })
                } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                }
                break
            case 'ytmp3':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
                ini_link = args[0]
                result = await fetchJson(`http://api.lolhuman.xyz/api/ytaudio?apikey=${apikey}&url=${ini_link}`)
                result = result.result
                caption = `\`❖ Title    :\` *${result.title}*\n`
                caption += `\`❖ Uploader :\` *${result.uploader}*\n`
                caption += `\`❖ Duration :\` *${result.duration}*\n`
                caption += `\`❖ View     :\` *${result.view}*\n`
                caption += `\`❖ Like     :\` *${result.like}*\n`
                caption += `\`❖ Dislike  :\` *${result.dislike}*\n`
                caption += `\`❖ Size     :\` *${result.link[3].size}*`
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                if (Number(result.link[3].size.split(` MB`)[0]) >= 50.00) return reply(`Sorry the bot cannot send more than 50 MB!`)
                await lol.replyWithAudio({ url: result.link[3].link }, { title: result.title, thumb: result.thumbnail })
                break
            case 'ytmp4':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
                ini_link = args[0]
                result = await fetchJson(`http://api.lolhuman.xyz/api/ytvideo?apikey=${apikey}&url=${ini_link}`)
                result = result.result
                caption = `\`❖ Title    :\` *${result.title}*\n`
                caption += `\`❖ Uploader :\` *${result.uploader}*\n`
                caption += `\`❖ Duration :\` *${result.duration}*\n`
                caption += `\`❖ View     :\` *${result.view}*\n`
                caption += `\`❖ Like     :\` *${result.like}*\n`
                caption += `\`❖ Dislike  :\` *${result.dislike}*\n`
                caption += `\`❖ Size     :\` *${result.link[3].size}*`
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                if (Number(result.link[0].size.split(` MB`)[0]) >= 50.00) return reply(`Sorry the bot cannot send more than 50 MB!`)
                await lol.replyWithVideo({ url: result.link[0].link }, { thumb: result.thumbnail })
                break
            case 'tiktoknowm':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`)
                url = args[0]
                url = `http://api.lolhuman.xyz/api/tiktok?apikey=${apikey}&url=${url}`
                result = await fetchJson(url)
                await lol.replyWithVideo({ url: result.result.link })
                break
            case 'tiktokmusic':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`)
                ini_link = args[0]
                await lol.replyWithAudio({ url: `http://api.lolhuman.xyz/api/tiktokmusic?apikey=${apikey}&url=${ini_link}` })
                break
            case 'spotify':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://open.spotify.com/track/0ZEYRVISCaqz5yamWZWzaA`)
                url = args[0]
                result = await fetchJson(`http://api.lolhuman.xyz/api/spotify?apikey=${apikey}&url=${url}`)
                result = result.result
                caption = `\`❖ Title      :\` *${result.title}*\n`
                caption += `\`❖ Artists    :\` *${result.artists}*\n`
                caption += `\`❖ Duration   :\` *${result.duration}*\n`
                caption += `\`❖ Popularity :\` *${result.popularity}*`
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                await lol.replyWithAudio({ url: result.link }, { title: result.title, thumb: result.thumbnail })
                break
            case 'spotifysearch':
                if (args.length == 0) return reply(`Example: ${prefix + command} Melukis Senja`)
                try {
                    query = args.join(" ")
                    result = await fetchJson(`http://api.lolhuman.xyz/api/spotifysearch?apikey=${apikey}&query=${query}`)
                    hasil = result.result.slice(0, 3)
                    hasil.forEach(async(res) => {
                        caption = `\`❖ Title     :\` *${res.title}*\n`
                        caption += `\`❖ Artists   :\` *${res.artists}*\n`
                        caption += `\`❖ Link      :\`* ${res.link} *\n`
                        caption += `\`❖ Duration  :\` *${res.duration}*\n`
                        await reply(caption)
                    })
                } catch (e) {
                    help.messageError(lol)
                }
                break
            case 'jooxplay':
                if (args.length == 0) return reply(`Example: ${prefix + command} Melukis Senja`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/jooxplay?apikey=${apikey}&query=${query}`)
                result = result.result
                caption = `\`❖ Title    :\` *${result.info.song}*\n`
                caption += `\`❖ Artists  :\` *${result.info.singer}*\n`
                caption += `\`❖ Duration :\` *${result.info.duration}*\n`
                caption += `\`❖ Album    :\` *${result.info.album}*\n`
                caption += `\`❖ Uploaded :\` *${result.info.date}*\n`
                caption += `\`❖ Lirik    :\`\n ${result.lirik}`
                await lol.replyWithPhoto({ url: result.image }, { caption: caption, parse_mode: "Markdown" })
                await lol.replyWithAudio({ url: result.link[0].link }, { title: result.info.song, thumb: result.image })
                break
            case 'zippyshare':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://www51.zippyshare.com/v/5W0TOBz1/file.html`)
                url = args[0]
                url = await fetchJson(`http://api.lolhuman.xyz/api/zippyshare?apikey=${apikey}&url=${url}`)
                url = url.result
                text = `\`❖ File Name    :\` *${url.name_file}*\n`
                text += `\`❖ Size         :\` *${url.size}*\n`
                text += `\`❖ Date Upload  :\` *${url.date_upload}*\n`
                text += `\`❖ Download Url :\` *${url.download_url}*`
                await reply(text)
                break
            case 'pinterest':
                if (args.length == 0) return reply(`Example: ${prefix + command} loli kawaii`)
                query = args.join(" ")
                url = await fetchJson(`http://api.lolhuman.xyz/api/pinterest?apikey=${apikey}&query=${query}`)
                url = url.result
                await lol.replyWithPhoto({ url: url })
                break
            case 'pinterestdl':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://id.pinterest.com/pin/696580267364426905/`)
                url = args[0]
                url = await fetchJson(`http://api.lolhuman.xyz/api/pinterestdl?apikey=${apikey}&url=${url}`)
                url = url.result["736x"]
                await lol.replyWithPhoto({ url: url })
                break
            case 'pixiv':
                if (args.length == 0) return reply(`Example: ${prefix + command} loli kawaii`)
                query = args.join(" ")
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/pixiv?apikey=${apikey}&query=${query}` })
                break
            case 'pixivdl':
                if (args.length == 0) return reply(`Example: ${prefix + command} 63456028`)
                pixivid = args[0]
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/pixivdl/${pixivid}?apikey=${apikey}` })
                break
            default:
        }
    } catch (e) {
        console.log(e)
    }
})


bot.launch()
bot.telegram.getMe().then((getme) => {
    itsPrefix = (prefix != "") ? prefix : "No Prefix"
    console.log(clc.greenBright(' ===================================================='))
    console.log(clc.greenBright(" │ + Owner    : " + owner))
    console.log(clc.greenBright(" │ + Bot Name : " + getme.first_name))
    console.log(clc.greenBright(" │ + Version  : " + version))
    console.log(clc.greenBright(" │ + Host     : " + os.hostname()))
    console.log(clc.greenBright(" │ + Platfrom : " + os.platform()))
    console.log(clc.greenBright(" │ + Core     : " + os.cpus()[0].model))
    console.log(clc.greenBright(" │ + Speed    : " + os.cpus()[0].speed + " MHz"))
    console.log(clc.greenBright(" │ + Core     : " + os.cpus().length))
    console.log(clc.greenBright(` │ + RAM      : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024)} MB`))
    console.log(clc.greenBright(" │ + Prefix   : " + itsPrefix))
    console.log(clc.greenBright(' ===================================================='))
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))