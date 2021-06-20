const fs = require('fs')
const moment = require('moment-timezone')
const config = JSON.parse(fs.readFileSync(`./config.json`))
const speed = require('performance-now')
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
const date = new Date().toLocaleDateString()
const wita = moment.tz('Asia/Makassar').format('HH:mm:ss')
const wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')        

const shape = '️꧉'			
const d = new Date
const locale = 'id'
const gmt = new Date(0).getTime() - new Date('1 January 2021').getTime()
const weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
const hari = d.toLocaleDateString(locale, { weekday: 'long' })
const datee = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
         }) 
const ini_hari = `${hari} ${weton}, ${datee}`

exports.start = async(lol, name) => {
    text = `Date: ${ini_hari}\nTime: ${time}\n\nHello ${name}! Im a multifunction bot build with ❤️ by  [my master](${config.ownerLink})\n\n type /help to display Menu!.`
    await lol.replyWithMarkdown(text, { disable_web_page_preview: true })
}

exports.help = async(lol, name, user_id) => {
    text = `Date: ${ini_hari}\nTime: ${time}\n\nHello ${name}! Here are the available commands you can use:\n\nrequest fitur chat owner @BryanRfly\n\n Semoga Hari Mu Menyean`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Islami ', callback_data: 'islami-' + user_id },
                    { text: 'Download ', callback_data: 'downloader-' + user_id }
                ],
                [
                    { text: 'Text Pro Me ', callback_data: 'textpro-' + user_id },
                    { text: 'Photo Oxy ', callback_data: 'phoxy-' + user_id },
                    { text: 'Ephoto 360 ', callback_data: 'ephoto-' + user_id }
                ],
                [
                    { text: 'Random Image ', callback_data: 'randimage-' + user_id },
                    { text: 'Random Text ', callback_data: 'randtext-' + user_id },
                ],
                [
                    { text: 'Anime ', callback_data: 'anime-' + user_id },
                    { text: 'Movie & Story ', callback_data: 'movie-' + user_id }, 
                    { text: 'Education ', callback_data: 'education-' + user_id },
                ],
                [ 
                    { text: 'Game & Fun', callback_data: 'game-' + user_id },
                    { text: 'About User', callback_data: 'user-' + user_id },
                ], 
                [
                    { text: 'Owner Only', callback_data: 'owner-' + user_id },
                ], 
                [
                    { text: 'Information', callback_data: 'info-' + user_id }, 
                    { text: 'Group & Admin', callback_data: 'gc-' + user_id },
                ],
            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

exports.islami = async(lol, user_id) => {
    prefix = config.prefix
    text = `Islami Menu :

${shape} ${prefix}listsurah
${shape} ${prefix}alquran no_surah
${shape} ${prefix}alquran no_surah/no_ayat
${shape} ${prefix}alquran no_surah/no_ayat1-no_ayat2
${shape} ${prefix}alquranaudio no_surah
${shape} ${prefix}alquranaudio no_surah/no_ayat
${shape} ${prefix}asmaulhusna
${shape} ${prefix}kisahnabi
${shape} ${prefix}jadwalsholat daerah
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.downloader = async(lol, user_id) => {
    prefix = config.prefix
    text = `Downloader Menu :

${shape} ${prefix}xnxxdl link
${shape} ${prefix}ytplay query
${shape} ${prefix}ytsearch query
${shape} ${prefix}ytmp3 link
${shape} ${prefix}ytmp4 link
${shape} ${prefix}tiktoknowm link
${shape} ${prefix}tiktokmusic link
${shape} ${prefix}tiktokmusic link
${shape} ${prefix}twitterimage link
${shape} ${prefix}spotify link
${shape} ${prefix}spotifysearch query
${shape} ${prefix}jooxplay query
${shape} ${prefix}zippyshare link
${shape} ${prefix}pinterest query
${shape} ${prefix}pinterestdl link
${shape} ${prefix}pixiv query
${shape} ${prefix}pixivdl pixiv_id
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.movie = async(lol, user_id) => {
    prefix = config.prefix
    text = `Movie & Story Menu :

${shape} ${prefix}drakorongoing
${shape} ${prefix}lk21 query
${shape} ${prefix}wattpad url_wattpad
${shape} ${prefix}wattpadsearch query
${shape} ${prefix}cerpen
${shape} ${prefix}ceritahoror
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}


exports.anime = async(lol, user_id) => {
    prefix = config.prefix
    text = `Anime Menu :

${shape} ${prefix}wait
${shape} ${prefix}manga query
${shape} ${prefix}anime query
${shape} ${prefix}character query
${shape} ${prefix}kusonime url_kusonime
${shape} ${prefix}kusonimesearch query
${shape} ${prefix}otakudesu url_otakudesu
${shape} ${prefix}otakudesusearch query
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.randtext = async(lol, user_id) => {
    prefix = config.prefix
    text = `Random Text Menu :

${shape} ${prefix}quotes
${shape} ${prefix}quotesdilan
${shape} ${prefix}quotesanime
${shape} ${prefix}quotesimage
${shape} ${prefix}faktaunik
${shape} ${prefix}katabijak
${shape} ${prefix}pantun
${shape} ${prefix}bucin
${shape} ${prefix}randomnama
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.randimage = async(lol, user_id) => {
    prefix = config.prefix
    text = `Radom Image Menu :

${shape} ${prefix}art
${shape} ${prefix}bts
${shape} ${prefix}exo
${shape} ${prefix}elf
${shape} ${prefix}loli
${shape} ${prefix}neko
${shape} ${prefix}waifu
${shape} ${prefix}shota
${shape} ${prefix}husbu
${shape} ${prefix}sagiri
${shape} ${prefix}shinobu
${shape} ${prefix}megumin
${shape} ${prefix}wallnime
${shape} ${prefix}chiisaihentai
${shape} ${prefix}trap
${shape} ${prefix}blowjob
${shape} ${prefix}yaoi
${shape} ${prefix}ecchi
${shape} ${prefix}hentai
${shape} ${prefix}ahegao
${shape} ${prefix}hololewd
${shape} ${prefix}sideoppai
${shape} ${prefix}animefeets
${shape} ${prefix}animebooty
${shape} ${prefix}animethighss
${shape} ${prefix}hentaiparadise
${shape} ${prefix}animearmpits
${shape} ${prefix}hentaifemdom
${shape} ${prefix}lewdanimegirls
${shape} ${prefix}biganimetiddies
${shape} ${prefix}animebellybutton
${shape} ${prefix}hentai4everyone
${shape} ${prefix}bj
${shape} ${prefix}ero
${shape} ${prefix}cum
${shape} ${prefix}feet
${shape} ${prefix}yuri
${shape} ${prefix}trap
${shape} ${prefix}lewd
${shape} ${prefix}feed
${shape} ${prefix}eron
${shape} ${prefix}solo
${shape} ${prefix}gasm
${shape} ${prefix}poke
${shape} ${prefix}anal
${shape} ${prefix}holo
${shape} ${prefix}tits
${shape} ${prefix}kuni
${shape} ${prefix}kiss
${shape} ${prefix}erok
${shape} ${prefix}smug
${shape} ${prefix}baka
${shape} ${prefix}solog
${shape} ${prefix}feetg
${shape} ${prefix}lewdk
${shape} ${prefix}waifu
${shape} ${prefix}pussy
${shape} ${prefix}femdom
${shape} ${prefix}cuddle
${shape} ${prefix}hentai
${shape} ${prefix}eroyuri
${shape} ${prefix}cum_jpg
${shape} ${prefix}blowjob
${shape} ${prefix}erofeet
${shape} ${prefix}holoero
${shape} ${prefix}classic
${shape} ${prefix}erokemo
${shape} ${prefix}fox_girl
${shape} ${prefix}futanari
${shape} ${prefix}lewdkemo
${shape} ${prefix}wallpaper
${shape} ${prefix}pussy_jpg
${shape} ${prefix}kemonomimi
${shape} ${prefix}nsfw_avatar
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.textpro = async(lol, user_id) => {
    prefix = config.prefix
    text = `Text Pro Me Menu :

${shape} ${prefix}blackpink text
${shape} ${prefix}neon text
${shape} ${prefix}greenneon text
${shape} ${prefix}advanceglow text
${shape} ${prefix}futureneon text
${shape} ${prefix}sandwriting text
${shape} ${prefix}sandsummer text
${shape} ${prefix}sandengraved text
${shape} ${prefix}metaldark text
${shape} ${prefix}neonlight text
${shape} ${prefix}holographic text
${shape} ${prefix}text1917 text
${shape} ${prefix}minion text
${shape} ${prefix}deluxesilver text
${shape} ${prefix}newyearcard text
${shape} ${prefix}bloodfrosted text
${shape} ${prefix}halloween text
${shape} ${prefix}jokerlogo text
${shape} ${prefix}fireworksparkle text
${shape} ${prefix}natureleaves text
${shape} ${prefix}bokeh text
${shape} ${prefix}toxic text
${shape} ${prefix}strawberry text
${shape} ${prefix}box3d text
${shape} ${prefix}roadwarning text
${shape} ${prefix}breakwall text
${shape} ${prefix}icecold text
${shape} ${prefix}luxury text
${shape} ${prefix}cloud text
${shape} ${prefix}summersand text
${shape} ${prefix}horrorblood text
${shape} ${prefix}thunder text
${shape} ${prefix}pornhub text1 text2
${shape} ${prefix}glitch text1 text2
${shape} ${prefix}avenger text1 text2
${shape} ${prefix}space text1 text2
${shape} ${prefix}ninjalogo text1 text2
${shape} ${prefix}marvelstudio text1 text2
${shape} ${prefix}lionlogo text1 text2
${shape} ${prefix}wolflogo text1 text2
${shape} ${prefix}steel3d text1 text2
${shape} ${prefix}wallgravity text1 text2
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}


exports.phoxy = async(lol, user_id) => {
    prefix = config.prefix
    text = `Photo Oxy Menu :

${shape} ${prefix}shadow text
${shape} ${prefix}cup text
${shape} ${prefix}cup1 text
${shape} ${prefix}romance text
${shape} ${prefix}smoke text
${shape} ${prefix}burnpaper text
${shape} ${prefix}lovemessage text
${shape} ${prefix}undergrass text
${shape} ${prefix}love text
${shape} ${prefix}coffe text
${shape} ${prefix}woodheart text
${shape} ${prefix}woodenboard text
${shape} ${prefix}summer3d text
${shape} ${prefix}wolfmetal text
${shape} ${prefix}nature3d text
${shape} ${prefix}underwater text
${shape} ${prefix}golderrose text
${shape} ${prefix}summernature text
${shape} ${prefix}letterleaves text
${shape} ${prefix}glowingneon text
${shape} ${prefix}fallleaves text
${shape} ${prefix}flamming text
${shape} ${prefix}harrypotter text
${shape} ${prefix}carvedwood text
${shape} ${prefix}tiktok text1 text2
${shape} ${prefix}arcade8bit text1 text2
${shape} ${prefix}battlefield4 text1 text2
${shape} ${prefix}pubg text1 text2
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.education = async(lol, user_id) => {
          prefix = config.prefix
          text = `Education To Help You Go To Schooln

${shape} ${prefix}translate
${shape} ${prefix}brainly
${shape} ${prefix}kbbi
${shape} ${prefix}wiki 
${shape} ${prefix}nulis
${shape} ${prefix}nulis1
${shape} ${prefix}nulis2
${shape} ${prefix}nulis3
${shape} ${prefix}nulis4
${shape} ${prefix}nulis5
${shape} ${prefix}nulis6
`
   await lol.editMessageText(text, {
     reply_markup: {
       inline_keyboard: [
             [
                { text: 'Back', callback_data: 'help-' + user_id } 
              ]
           ]
        }
    })
} 

exports.game = async(lol, user_id) => {
	prefix = config.prefix
	text = `A Very Fun Game To Entertain You!

${shape} ${prefix}caklontong
${shape} ${prefix}tebakgambar
${shape} ${prefix}tebakbendera
${shape} ${prefix}tebakangka
${shape} ${prefix}siapaaku
${shape} ${prefix}asahotak
${shape} ${prefix}family100
${shape} ${prefix}tebakkata
${shape} ${prefix}susunkata 
${shape} ${prefix}meme
`         
   await lol.editMessageText(text, {
     reply_markup: {
       inline_keyboard: [
             [
                { text: 'Back', callback_data: 'help-' + user_id } 
              ]
           ]
        }
    })
} 

exports.user = async(lol, user_id) => { 
    prefix = config.prefix
    text = `validate about your information!

${shape} ${prefix}status    
${shape} ${prefix}daftar
${shape} ${prefix}unreg
${shape} ${prefix}getid

`
await lol.editMessageText(text, {
     reply_markup: {
       inline_keyboard: [
             [
                { text: 'Back', callback_data: 'help-' + user_id } 
              ]
           ]
        }
    })
} 

exports.info = async(lol, user_id) => {
    prefix = config.prefix 
    text = `look for the latest information so you dont miss the information! 

${shape} ${prefix}igstalk
${shape} ${prefix}tiktokstalk
${shape} ${prefix}twitstalk
${shape} ${prefix}kodepos
${shape} ${prefix}covid
${shape} ${prefix}infogempa
${shape} ${prefix}infotsunami
${shape} ${prefix}infocuacabandara
${shape} ${prefix}infocuacadunia
`

await lol.editMessageText(text, {
     reply_markup: {
       inline_keyboard: [
             [
                { text: 'Back', callback_data: 'help-' + user_id } 
              ]
           ]
        }
    })
}
exports.gc = async(lol, user_id) => { 
    prefix = config.prefix
    text = `Command Only For Group!
    
${shape} ${prefix}gcdesk
${shape} ${prefix}gctitle 
${shape} ${prefix}gcpict  
${shape} ${prefix}leave
${shape} ${prefix}delpict
${shape} ${prefix}infochat
${shape} ${prefix}chatscount
`  
await lol.editMessageText(text, {
     reply_markup: {
       inline_keyboard: [
             [
                { text: 'Back', callback_data: 'help-' + user_id } 
              ]
           ]
        }
    })
}
exports.owner = async(lol, user_id) => {
    prefix = config.prefix
    text = `Owner's Special Features So You Can't Use It

${shape} ${prefix}ban 
${shape} ${prefix}unban
${shape} ${prefix}adduser
${shape} ${prefix}resetban
${shape} ${prefix}resetuser
${shape} ${prefix}shutdown
`
await lol.editMessageText(text, {
     reply_markup: {
       inline_keyboard: [
             [
                { text: 'Back', callback_data: 'help-' + user_id } 
              ]
           ]
        }
    })
} 
exports.ephoto = async(lol, user_id) => {
    prefix = config.prefix
    text = `Ephoto 360 Menu :

${shape} ${prefix}wetglass text
${shape} ${prefix}multicolor3d text
${shape} ${prefix}watercolor text
${shape} ${prefix}luxurygold text
${shape} ${prefix}galaxywallpaper text
${shape} ${prefix}lighttext text
${shape} ${prefix}beautifulflower text
${shape} ${prefix}puppycute text
${shape} ${prefix}royaltext text
${shape} ${prefix}heartshaped text
${shape} ${prefix}birthdaycake text
${shape} ${prefix}galaxystyle text
${shape} ${prefix}hologram3d text
${shape} ${prefix}greenneon text
${shape} ${prefix}glossychrome text
${shape} ${prefix}greenbush text
${shape} ${prefix}metallogo text
${shape} ${prefix}noeltext text
${shape} ${prefix}glittergold text
${shape} ${prefix}textcake text
${shape} ${prefix}starsnight text
${shape} ${prefix}wooden3d text
${shape} ${prefix}textbyname text
${shape} ${prefix}writegalacy text
${shape} ${prefix}galaxybat text
${shape} ${prefix}snow3d text
${shape} ${prefix}birthdayday text
${shape} ${prefix}goldplaybutton text
${shape} ${prefix}silverplaybutton text
${shape} ${prefix}freefire text
${shape} ${prefix}cartoongravity text
${shape} ${prefix}anonymhacker text
${shape} ${prefix}anonymhacker text
${shape} ${prefix}mlwall text
${shape} ${prefix}pubgmaskot text
${shape} ${prefix}aovwall text
${shape} ${prefix}logogaming text
${shape} ${prefix}fpslogo text
${shape} ${prefix}avatarlolnew text
${shape} ${prefix}lolbanner text
${shape} ${prefix}avatardota text
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.messageError = async(lol) => {
    await lol.reply(`Error! Please report to the [${config.owner}](${config.ownerLink}) about this`, { parse_mode: "Markdown", disable_web_page_preview: true })
}
