// Import
const {Client, GatewayIntentBits} = require('discord.js')
const {readdirSync} = require('fs')

const sql = require('better-sqlite3')

const db = new sql('data.sqlite')

// Create Client
const Bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
})

// Settings
const Token = 'TOKEN HERE'
const Id = 'ID HERE'

const Queries = [
    'CREATE TABLE IF NOT EXISTS `github` (`channel` varchar(255) NOT NULL)',
    'CREATE TABLE IF NOT EXISTS `workshop_channels` (`type` varchar(255) NOT NULL, `channel` varchar(255) NOT NULL)',
    'CREATE TABLE IF NOT EXISTS `workshop_requests` (`user` varchar(255) NOT NULL, `id` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `desc` varchar(255) NOT NULL, `github` varchar(255) NOT NULL, `credits` varchar(255) NOT NULL)',
    'CREATE TABLE IF NOT EXISTS `workshop_posts` (`user` varchar(255) NOT NULL, `message` varchar(255) NOT NULL, `channel` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `desc` varchar(255) NOT NULL, `github` varchar(255) NOT NULL, `credits` varchar(255) NOT NULL)'
].forEach(e => db.exec(e))

// For us to look submit commands to the but using REST
Bot["token"] = Token
Bot["id"] = Id
Bot['db'] = db
Bot['updateWorkshop'] = require('./workshop/handler')
Bot['getPosts'] = (user) => {
    const requests = db.prepare('SELECT * FROM `workshop_requests` WHERE `user` = ?').all(user)
    const posts = db.prepare('SELECT * FROM `workshop_posts` WHERE `user` = ?').all(user)
    posts.forEach(e => {
        e['isPost'] = true
        requests.push(e)
    })

    return requests
}

process.on('uncaughtException', (err) => {
    const channel = Bot.channels.cache.get('1050139660606771272')
    console.log(err)
    channel.send("error occurred: `"+err+'` please fix this!\nwhole error: ```'+JSON.stringify(err)+'```')
    return true
});

// Operators
const Handler = {
    file: "handlers/",
    loaded: [],
    load: (path) => {
        const f = require('./'+path)
        const events = f.events
        const start = f.start
        const handlers = f.handler
        const p = handlers.path

        for (const [k,v] of Object.entries(events)) Bot.on(k , (...args) => v(...args, Bot))

        const paths = []
        Handler.look(p, Handler.look, (pp) => paths.push(require('./'+pp)))
        start(Bot, paths)
    },
    look: (path, look, load) => {
        readdirSync(path).forEach(f => {
            if (!f.endsWith(".js")) {
                look(path+f+'/', look, load)
            } else {
                load(path+f)
            }
        })
    }
}

Handler.look(Handler.file, Handler.look, Handler.load)

Bot.login(Token)