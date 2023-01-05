module.exports = {
    button: {
        id: 'acceptPost',
        contains: true
    },
    execute: async(interaction, bot) => {
        const id = interaction.customId.split('*')[1]
        const db = bot['db']

        const data = db.prepare('SELECT * FROM `workshop_requests` WHERE `id` = ?').get(id)
        if (data == null) {
            interaction.message.delete()
            return interaction.reply({
                content: "This request was not found",
                ephemeral: true
            })
        }

        const channel = db.prepare('SELECT * FROM `workshop_channels` WHERE `type` = ?').get('posts')

        if(channel == null) {
            return interaction.reply({
                content: "Whoops, no post channels seems to be set - please report this",
                ephemeral: true
            })
        }

        interaction.reply({
            content: "You accepted post `"+id+"` by user `"+data.user+"`",
            ephemeral: true
        })

        db.prepare('DELETE FROM `workshop_requests` WHERE `id` = ?').run(id)

        bot.channels.cache.get(channel.channel).send({
            embeds: [
                {
                    "title": data.name,
                    "description": data.desc,
                    "color": 16101633,
                    "fields": [
                        {
                            "name": "User",
                            "value": "<@"+data.user+">"
                        },
                        {
                            "name": "Github",
                            "value": data.github
                        },
                        {
                            "name": "Credits",
                            "value": data.credits
                        }
                    ],
                }
            ]
        }).then((msg) => {
            db.prepare('INSERT INTO `workshop_posts` (`user`, `message`, `channel`, `name`, `desc`, `github`, `credits`) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
                data.user,
                msg.id,
                channel.channel,
                data.name,
                data.desc,
                data.github,
                data.credits
            )

            interaction.message.delete()
        })
    }
    
}