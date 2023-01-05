const get = (i,n) => {return i.fields.getTextInputValue(n)}
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const crypto = require('crypto');
const { ButtonStyle } = require('discord.js');

module.exports = {
    modal: {
        id: 'createPost'
    },
    execute: async(interaction, bot) => {
        const db = bot['db']
        const user = interaction.user.id

        const name = get(interaction, 'name')
        const description = get(interaction, 'description')
        const github = get(interaction, 'github')
        const credits = get(interaction, 'credits') ?? ''

        const post = bot['getPosts'](user)
        var found = false
        post.forEach(e => {
            if (e.name == name) found = true
        })
        if (found == true) {
            return interaction.reply({
                content: "Cannot have two posts have the same name",
                ephemeral: true
            })
        }

        const channel = db.prepare('SELECT * FROM `workshop_channels` WHERE `type` = ?').get('requests')

        if(channel == null) {
            return interaction.reply({
                content: "Whoops, no post channels seems to be set - please report this",
                ephemeral: true
            })
        }

        interaction.reply({
            content: "Your post is now in review. This can take some time, you will get a private message when you get a answer. Or you will see it in <#1049420824320426014> :)",
            ephemeral: true
        })

        const ch = bot.channels.cache.get(channel.channel)
        
        const id = crypto.randomUUID()

        ch.send({
            embeds: [
                {
                    "title": name,
                    "description": description,
                    "color": 16101633,
                    "fields": [
                        {
                            "name": "Github",
                            "value": github
                        },
                        {
                            "name": "Credits",
                            "value": credits
                        },
                        {
                            "name": "User",
                            "value": "<@"+user+">"
                        }
                    ],
                    "footer": {
                        "text": "ID: "+id
                    }
                }
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Accept")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId("acceptPost*"+id),
                        new ButtonBuilder()
                            .setLabel("Decline")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("declinePost*"+id)
                    )
            ]
        })


        db.prepare('INSERT INTO `workshop_requests` (`user`, `id`, `name`, `desc`, `github`, `credits`) VALUES (?,?,?,?,?,?)').run(
            user,
            id,
            name,
            description,
            github,
            credits
        )
    }
}