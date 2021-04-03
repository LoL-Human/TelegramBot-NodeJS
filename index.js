const { fetchJson, range } = require('./lib/function')
const { Telegraf } = require('telegraf')
const help = require('./lib/help')
const tele = require('./lib/tele')
const chalk = require('chalk')
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
    const isGroup = lol.chat.type.includes("group")
    const groupName = isGroup ? lol.chat.title : ""
    if (!isGroup) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[   ACT   ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
    if (isGroup) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[   ACT   ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
    switch (callback_data) {
        case 'islami':
            await help.islami(lol)
            break
        case 'downloader':
            await help.download(lol)
            break
        case 'textpro':
            await help.textpro(lol)
            break
        case 'phoxy':
            await help.phoxy(lol)
            break
        case 'ephoto':
            await help.ephoto(lol)
            break
        case 'randimage':
            await help.randimage(lol)
            break
        case 'randtext':
            await help.randtext(lol)
            break
        case 'anime':
            await help.anime(lol)
            break
        case 'movie':
            await help.movie(lol)
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
        cmd = false
        if (prefix != "" && body.startsWith(prefix)) {
            cmd = true
            comm = body.slice(1).trim().split(" ").shift().toLowerCase()
        }
        const command = comm
        const args = await tele.getArgs(lol)
        const user = await tele.getUser(lol)

        const reply = async(text) => {
            for (var x of range(0, text.length, 4096)) {
                await lol.replyWithMarkdown(text.substr(x, 4096))
            }
        }

        const isCmd = cmd
        const isGroup = lol.chat.type.includes("group")
        const groupName = isGroup ? lol.chat.title : ""

        const quotedMessage = lol.message.reply_to_message || {}
        const isQuotedImage = quotedMessage.photo ? true : false
        const isQuotedVideo = quotedMessage.video ? true : false
        const isQuotedSticker = quotedMessage.sticker ? true : false
        const isQuotedDocument = quotedMessage.document ? true : false
        const isQuotedAnimation = quotedMessage.animation ? true : false

        if (!isGroup && !isCmd) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[ PRIVATE ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && !isCmd) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[  GROUP  ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
        if (!isGroup && isCmd) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && isCmd) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))

        async function getFileID() {
            file_id = ""
            if (isQuotedImage) {
                photo = lol.message.reply_to_message.photo
                file_id = photo[photo.length - 1].file_id
            } else if (isQuotedDocument) {
                file_id = lol.message.reply_to_message.document.file_id
            } else if (isQuotedVideo) {
                file_id = lol.message.reply_to_message.video.file_id
            } else if (isQuotedAnimation) {
                file_id = lol.message.reply_to_message.animation.file_id
            }
            return file_id
        }

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
                await lol.replyWithAudio({ url: result.audio[3].link })
                await lol.replyWithVideo({ url: result.video[0].link })
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

                // AniManga //
            case 'character':
                if (args.length == 0) return reply(`Example: ${prefix + command} Miku Nakano`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/character?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Id : ${result.id}\n`
                text += `Name : ${result.name.full}\n`
                text += `Native : ${result.name.native}\n`
                text += `Favorites : ${result.favourites}\n`
                text += `Media : \n`
                ini_media = result.media.nodes
                for (var x of ini_media) {
                    text += `- ${x.title.romaji} (${x.title.native})\n`
                }
                text += `\nDescription : \n${result.description.replace(/__/g, "_")}`
                await lol.replyWithPhoto({ url: result.image.large }, { caption: text })
                break
            case 'manga':
                if (args.length == 0) return reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/manga?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Id : ${result.id}\n`
                text += `Id MAL : ${result.idMal}\n`
                text += `Title : ${result.title.romaji}\n`
                text += `English : ${result.title.english}\n`
                text += `Native : ${result.title.native}\n`
                text += `Format : ${result.format}\n`
                text += `Chapters : ${result.chapters}\n`
                text += `Volume : ${result.volumes}\n`
                text += `Status : ${result.status}\n`
                text += `Source : ${result.source}\n`
                text += `Start Date : ${result.startDate.day} - ${result.startDate.month} - ${result.startDate.year}\n`
                text += `End Date : ${result.endDate.day} - ${result.endDate.month} - ${result.endDate.year}\n`
                text += `Genre : ${result.genres.join(", ")}\n`
                text += `Synonyms : ${result.synonyms.join(", ")}\n`
                text += `Score : ${result.averageScore}%\n`
                text += `Characters : \n`
                ini_character = result.characters.nodes
                for (var x of ini_character) {
                    text += `- ${x.name.full} (${x.name.native})\n`
                }
                text += `\nDescription : ${result.description}`
                await lol.replyWithPhoto({ url: result.coverImage.large }, { caption: text })
                break
            case 'anime':
                if (args.length == 0) return reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/anime?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Id : ${result.id}\n`
                text += `Id MAL : ${result.idMal}\n`
                text += `Title : ${result.title.romaji}\n`
                text += `English : ${result.title.english}\n`
                text += `Native : ${result.title.native}\n`
                text += `Format : ${result.format}\n`
                text += `Episodes : ${result.episodes}\n`
                text += `Duration : ${result.duration} mins.\n`
                text += `Status : ${result.status}\n`
                text += `Season : ${result.season}\n`
                text += `Season Year : ${result.seasonYear}\n`
                text += `Source : ${result.source}\n`
                text += `Start Date : ${result.startDate.day} - ${result.startDate.month} - ${result.startDate.year}\n`
                text += `End Date : ${result.endDate.day} - ${result.endDate.month} - ${result.endDate.year}\n`
                text += `Genre : ${result.genres.join(", ")}\n`
                text += `Synonyms : ${result.synonyms.join(", ")}\n`
                text += `Score : ${result.averageScore}%\n`
                text += `Characters : \n`
                ini_character = result.characters.nodes
                for (var x of ini_character) {
                    text += `- ${x.name.full} (${x.name.native})\n`
                }
                text += `\nDescription : ${result.description}`
                await lol.replyWithPhoto({ url: result.coverImage.large }, { caption: text })
                break
            case 'wait':
                if (isQuotedImage || isQuotedAnimation || isQuotedVideo || isQuotedDocument) {
                    file_id = await getFileID()
                    url_file = await tele.getLink(file_id)
                    result = await fetchJson(`http://api.lolhuman.xyz/api/wait?apikey=${apikey}&img=${url_file}`)
                    result = result.result
                    text = `Anilist id : ${result.anilist_id}\n`
                    text += `MAL id : ${result.mal_id}\n`
                    text += `Title Romaji : ${result.title_romaji}\n`
                    text += `Title Native : ${result.title_native}\n`
                    text += `Title English : ${result.title_english}\n`
                    text += `At : ${result.at}\n`
                    text += `Episode : ${result.episode}\n`
                    text += `Similarity : ${result.similarity}`
                    await lol.replyWithVideo({ url: result.video }, { caption: text })
                } else {
                    reply(`Tag gambar yang sudah dikirim`)
                }
                break
            case 'kusonime':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://kusonime.com/nanatsu-no-taizai-bd-batch-subtitle-indonesia/`)
                ini_url = args[0]
                result = await fetchJson(`http://api.lolhuman.xyz/api/kusonime?apikey=${apikey}&url=${ini_url}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Japanese : ${result.japanese}\n`
                text += `Genre : ${result.genre}\n`
                text += `Seasons : ${result.seasons}\n`
                text += `Producers : ${result.producers}\n`
                text += `Type : ${result.type}\n`
                text += `Status : ${result.status}\n`
                text += `Total Episode : ${result.total_episode}\n`
                text += `Score : ${result.score}\n`
                text += `Duration : ${result.duration}\n`
                text += `Released On : ${result.released_on}\n`
                text += `Desc : ${result.desc}\n`
                link_dl = result.link_dl
                for (var x in link_dl) {
                    text += `\n${x}\n`
                    for (var y in link_dl[x]) {
                        text += `${y} - ${link_dl[x][y]}\n`
                    }
                }
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: text })
                break
            case 'kusonimesearch':
                if (args.length == 0) return reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/kusonimesearch?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Japanese : ${result.japanese}\n`
                text += `Genre : ${result.genre}\n`
                text += `Seasons : ${result.seasons}\n`
                text += `Producers : ${result.producers}\n`
                text += `Type : ${result.type}\n`
                text += `Status : ${result.status}\n`
                text += `Total Episode : ${result.total_episode}\n`
                text += `Score : ${result.score}\n`
                text += `Duration : ${result.duration}\n`
                text += `Released On : ${result.released_on}\n`
                text += `Desc : ${result.desc}\n`
                link_dl = result.link_dl
                for (var x in link_dl) {
                    text += `\n${x}\n`
                    for (var y in link_dl[x]) {
                        text += `${y} - ${link_dl[x][y]}\n`
                    }
                }
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: text })
                break
            case 'otakudesu':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://otakudesu.tv/lengkap/pslcns-sub-indo/`)
                ini_url = args[0]
                result = await fetchJson(`http://api.lolhuman.xyz/api/otakudesu?apikey=${apikey}&url=${ini_url}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Japanese : ${result.japanese}\n`
                text += `Judul : ${result.judul}\n`
                text += `Type : ${result.type}\n`
                text += `Episode : ${result.episodes}\n`
                text += `Aired : ${result.aired}\n`
                text += `Producers : ${result.producers}\n`
                text += `Genre : ${result.genres}\n`
                text += `Duration : ${result.duration}\n`
                text += `Studios : ${result.status}\n`
                text += `Rating : ${result.rating}\n`
                text += `Credit : ${result.credit}\n`
                get_link = result.link_dl
                for (var x in get_link) {
                    text += `\n\n*${get_link[x].title}*\n`
                    for (var y in get_link[x].link_dl) {
                        ini_info = get_link[x].link_dl[y]
                        text += `\n\`\`\`Reso : \`\`\`${ini_info.reso}\n`
                        text += `\`\`\`Size : \`\`\`${ini_info.size}\n`
                        text += `\`\`\`Link : \`\`\`\n`
                        down_link = ini_info.link_dl
                        for (var z in down_link) {
                            text += `${z} - ${down_link[z]}\n`
                        }
                    }
                }
                await reply(text)
                break
            case 'otakudesusearch':
                if (args.length == 0) return reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/otakudesusearch?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Japanese : ${result.japanese}\n`
                text += `Judul : ${result.judul}\n`
                text += `Type : ${result.type}\n`
                text += `Episode : ${result.episodes}\n`
                text += `Aired : ${result.aired}\n`
                text += `Producers : ${result.producers}\n`
                text += `Genre : ${result.genres}\n`
                text += `Duration : ${result.duration}\n`
                text += `Studios : ${result.status}\n`
                text += `Rating : ${result.rating}\n`
                text += `Credit : ${result.credit}\n`
                get_link = result.link_dl
                for (var x in get_link) {
                    text += `\n\n*${get_link[x].title}*\n`
                    for (var y in get_link[x].link_dl) {
                        ini_info = get_link[x].link_dl[y]
                        text += `\n\`\`\`Reso : \`\`\`${ini_info.reso}\n`
                        text += `\`\`\`Size : \`\`\`${ini_info.size}\n`
                        text += `\`\`\`Link : \`\`\`\n`
                        down_link = ini_info.link_dl
                        for (var z in down_link) {
                            text += `${z} - ${down_link[z]}\n`
                        }
                    }
                }
                await reply(text)
                break

                // Movie & Story
            case 'lk21':
                if (args.length == 0) return reply(`Example: ${prefix + command} Transformer`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/lk21?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Link : ${result.link}\n`
                text += `Genre : ${result.genre}\n`
                text += `Views : ${result.views}\n`
                text += `Duration : ${result.duration}\n`
                text += `Tahun : ${result.tahun}\n`
                text += `Rating : ${result.rating}\n`
                text += `Desc : ${result.desc}\n`
                text += `Actors : ${result.actors.join(", ")}\n`
                text += `Location : ${result.location}\n`
                text += `Date Release : ${result.date_release}\n`
                text += `Language : ${result.language}\n`
                text += `Link Download : ${result.link_dl}`
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: text })
                break
            case 'drakorongoing':
                result = await fetchJson(`http://api.lolhuman.xyz/api/drakorongoing?apikey=${apikey}`)
                result = result.result
                text = "Ongoing Drakor\n\n"
                for (var x of result) {
                    text += `Title : ${x.title}\n`
                    text += `Link : ${x.link}\n`
                    text += `Thumbnail : ${x.thumbnail}\n`
                    text += `Year : ${x.category}\n`
                    text += `Total Episode : ${x.total_episode}\n`
                    text += `Genre : ${x.genre.join(", ")}\n\n`
                }
                await reply(text)
                break
            case 'wattpad':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://www.wattpad.com/707367860-kumpulan-quote-tere-liye-tere-liye-quote-quote`)
                ini_url = args[0]
                result = await fetchJson(`http://api.lolhuman.xyz/api/wattpad?apikey=${apikey}&url=${ini_url}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Rating : ${result.rating}\n`
                text += `Motify date : ${result.modifyDate}\n`
                text += `Create date: ${result.createDate}\n`
                text += `Word : ${result.word}\n`
                text += `Comment : ${result.comment}\n`
                text += `Vote : ${result.vote}\n`
                text += `Reader : ${result.reader}\n`
                text += `Pages : ${result.pages}\n`
                text += `Description : ${result.desc}\n\n`
                text += `Story : \n${result.story}`
                await lol.replyWithPhoto({ url: result.photo }, { caption: text })
                break
            case 'wattpadsearch':
                if (args.length == 0) return reply(`Example: ${prefix + command} Tere Liye`)
                query = args.join(" ")
                result = await fetchJson(`http://api.lolhuman.xyz/api/wattpadsearch?apikey=${apikey}&query=${query}`)
                result = result.result
                text = "Wattpad Seach : \n"
                for (var x of result) {
                    text += `Title : ${x.title}\n`
                    text += `Url : ${x.url}\n`
                    text += `Part : ${x.parts}\n`
                    text += `Motify date : ${x.modifyDate}\n`
                    text += `Create date: ${x.createDate}\n`
                    text += `Coment count: ${x.commentCount}\n\n`
                }
                await reply(text)
                break
            case 'cerpen':
                result = await fetchJson(`http://api.lolhuman.xyz/api/cerpen?apikey=${apikey}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Creator : ${result.creator}\n`
                text += `Story :\n${result.cerpen}`
                await reply(text)
                break
            case 'ceritahoror':
                result = await fetchJson(`http://api.lolhuman.xyz/api/ceritahoror?apikey=${apikey}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Desc : ${result.desc}\n`
                text += `Story :\n${result.story}\n`
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: text })
                break

                // Random Text //
            case 'quotes':
                quotes = await fetchJson(`http://api.lolhuman.xyz/api/random/quotes?apikey=${apikey}`)
                quotes = quotes.result
                author = quotes.by
                quotes = quotes.quote
                await reply(`_${quotes}_\n\n*― ${author}*`)
                break
            case 'quotesanime':
                quotes = await fetchJson(`http://api.lolhuman.xyz/api/random/quotesnime?apikey=${apikey}`)
                quotes = quotes.result
                quote = quotes.quote
                char = quotes.character
                anime = quotes.anime
                episode = quotes.episode
                await reply(`_${quote}_\n\n*― ${char}*\n*― ${anime} ${episode}*`)
                break
            case 'quotesdilan':
                quotedilan = await fetchJson(`http://api.lolhuman.xyz/api/quotes/dilan?apikey=${apikey}`)
                await reply(quotedilan.result)
                break
            case 'quotesimage':
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/random/${command}?apikey=${apikey}` })
                break
            case 'faktaunik':
            case 'katabijak':
            case 'pantun':
            case 'bucin':
                result = await fetchJson(`http://api.lolhuman.xyz/api/random/${command}?apikey=${apikey}`)
                await reply(result.result)
                break
            case 'randomnama':
                result = await fetchJson(`http://api.lolhuman.xyz/api/random/nama?apikey=${apikey}`)
                await reply(result.result)
                break

                // Random Image //
            case 'art':
            case 'bts':
            case 'exo':
            case 'elf':
            case 'loli':
            case 'neko':
            case 'waifu':
            case 'shota':
            case 'husbu':
            case 'sagiri':
            case 'shinobu':
            case 'megumin':
            case 'wallnime':
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/random/${command}?apikey=${apikey}` })
                break
            case 'chiisaihentai':
            case 'trap':
            case 'blowjob':
            case 'yaoi':
            case 'ecchi':
            case 'hentai':
            case 'ahegao':
            case 'hololewd':
            case 'sideoppai':
            case 'animefeets':
            case 'animebooty':
            case 'animethighss':
            case 'hentaiparadise':
            case 'animearmpits':
            case 'hentaifemdom':
            case 'lewdanimegirls':
            case 'biganimetiddies':
            case 'animebellybutton':
            case 'hentai4everyone':
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/random/nsfw/${command}?apikey=${apikey}` })
                break
            case 'bj':
            case 'ero':
            case 'cum':
            case 'feet':
            case 'yuri':
            case 'trap':
            case 'lewd':
            case 'feed':
            case 'eron':
            case 'solo':
            case 'gasm':
            case 'poke':
            case 'anal':
            case 'holo':
            case 'tits':
            case 'kuni':
            case 'kiss':
            case 'erok':
            case 'smug':
            case 'baka':
            case 'solog':
            case 'feetg':
            case 'lewdk':
            case 'waifu':
            case 'pussy':
            case 'femdom':
            case 'cuddle':
            case 'hentai':
            case 'eroyuri':
            case 'cum_jpg':
            case 'blowjob':
            case 'erofeet':
            case 'holoero':
            case 'classic':
            case 'erokemo':
            case 'fox_girl':
            case 'futanari':
            case 'lewdkemo':
            case 'wallpaper':
            case 'pussy_jpg':
            case 'kemonomimi':
            case 'nsfw_avatar':
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/random2/${command}?apikey=${apikey}` })
                break

                // Textprome //
            case 'blackpink':
            case 'neon':
            case 'greenneon':
            case 'advanceglow':
            case 'futureneon':
            case 'sandwriting':
            case 'sandsummer':
            case 'sandengraved':
            case 'metaldark':
            case 'neonlight':
            case 'holographic':
            case 'text1917':
            case 'minion':
            case 'deluxesilver':
            case 'newyearcard':
            case 'bloodfrosted':
            case 'halloween':
            case 'jokerlogo':
            case 'fireworksparkle':
            case 'natureleaves':
            case 'bokeh':
            case 'toxic':
            case 'strawberry':
            case 'box3d':
            case 'roadwarning':
            case 'breakwall':
            case 'icecold':
            case 'luxury':
            case 'cloud':
            case 'summersand':
            case 'horrorblood':
            case 'thunder':
                if (args.length == 0) return reply(`Example: ${prefix + command} LoL Human`)
                text = args.join(" ")
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/textprome/${command}?apikey=${apikey}&text=${text}` })
                break
            case 'pornhub':
            case 'glitch':
            case 'avenger':
            case 'space':
            case 'ninjalogo':
            case 'marvelstudio':
            case 'lionlogo':
            case 'wolflogo':
            case 'steel3d':
            case 'wallgravity':
                if (args.length == 0) return reply(`Example: ${prefix + command} LoL Human`)
                txt1 = args[0]
                txt2 = args[1]
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/textprome2/${command}?apikey=${apikey}&text1=${txt1}&text2=${txt2}` })
                break

                // Photo Oxy //
            case 'shadow':
            case 'cup':
            case 'cup1':
            case 'romance':
            case 'smoke':
            case 'burnpaper':
            case 'lovemessage':
            case 'undergrass':
            case 'love':
            case 'coffe':
            case 'woodheart':
            case 'woodenboard':
            case 'summer3d':
            case 'wolfmetal':
            case 'nature3d':
            case 'underwater':
            case 'golderrose':
            case 'summernature':
            case 'letterleaves':
            case 'glowingneon':
            case 'fallleaves':
            case 'flamming':
            case 'harrypotter':
            case 'carvedwood':
                if (args.length == 0) return reply(`Example: ${prefix + command} LoL Human`)
                text = args.join(" ")
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/photooxy1/${command}?apikey=${apikey}&text=${text}` })
                break
            case 'tiktok':
            case 'arcade8bit':
            case 'battlefield4':
            case 'pubg':
                if (args.length == 0) return reply(`Example: ${prefix + command} LoL Human`)
                txt1 = args[0]
                txt2 = args[1]
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/photooxy2/${command}?apikey=${apikey}&text1=${txt1}&text2=${txt2}` })
                break

                // Ephoto 360 //
            case 'wetglass':
            case 'multicolor3d':
            case 'watercolor':
            case 'luxurygold':
            case 'galaxywallpaper':
            case 'lighttext':
            case 'beautifulflower':
            case 'puppycute':
            case 'royaltext':
            case 'heartshaped':
            case 'birthdaycake':
            case 'galaxystyle':
            case 'hologram3d':
            case 'greenneon':
            case 'glossychrome':
            case 'greenbush':
            case 'metallogo':
            case 'noeltext':
            case 'glittergold':
            case 'textcake':
            case 'starsnight':
            case 'wooden3d':
            case 'textbyname':
            case 'writegalacy':
            case 'galaxybat':
            case 'snow3d':
            case 'birthdayday':
            case 'goldplaybutton':
            case 'silverplaybutton':
            case 'freefire':
                if (args.length == 0) return reply(`Example: ${prefix + command} LoL Human`)
                text = args.join(" ")
                await lol.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/ephoto1/${command}?apikey=${apikey}&text=${text}` })
                break
            default:
                if (!isGroup && !isCmd) {
                    await lol.replyWithChatAction("typing")
                    simi = await fetchJson(`http://api.lolhuman.xyz/api/simi?apikey=${apikey}&text=${body}`)
                    await reply(simi.result)
                }
        }
    } catch (e) {
        console.log(chalk.cyanBright("[  ERROR  ]"), chalk.redBright(e))
    }
})


bot.launch()
bot.telegram.getMe().then((getme) => {
    itsPrefix = (prefix != "") ? prefix : "No Prefix"
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.greenBright(" │ + Owner    : " + owner || ""))
    console.log(chalk.greenBright(" │ + Bot Name : " + getme.first_name || ""))
    console.log(chalk.greenBright(" │ + Version  : " + version || ""))
    console.log(chalk.greenBright(" │ + Host     : " + os.hostname() || ""))
    console.log(chalk.greenBright(" │ + Platfrom : " + os.platform() || ""))
    console.log(chalk.greenBright(" │ + Core     : " + os.cpus()[0].model || ""))
    console.log(chalk.greenBright(" │ + Speed    : " + os.cpus()[0].speed || "" + " MHz"))
    console.log(chalk.greenBright(" │ + Core     : " + os.cpus().length || ""))
    console.log(chalk.greenBright(` │ + RAM      : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024)} MB`))
    console.log(chalk.greenBright(" │ + Prefix   : " + itsPrefix))
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.whiteBright('╭─── [ LOG ]'))
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))