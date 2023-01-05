module.exports = {
    event: 'interactionCreate', // Event name
    type: 'on', // Type, 'on' or 'once'
    load: () => {}, // When this file has been loaded
    execute: (interaction, bot) => {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId === 'deletePosts') {
            const db = bot['db']
            const selected = interaction.values[0];
            const user = interaction.user.id

            const data = bot['getPosts'](user)
            var found = false
            data.forEach(e => {
                if (e.name == selected) {
                    if (e.isPost) {
                        const channel = bot.channels.cache.get(e.channel)
                        interaction.reply({
                            content: "Deleting post...",
                            ephemeral: true
                        }).then(() => {
                            channel.messages.fetch(e.message).then((message) => {
                                if (message == null) {
                                    interaction.editReply({
                                        content: "Cannot find post message, still continuing"
                                    })
                                } else {
                                    message.delete()
                                }
                            })

                            db.prepare('DELETE FROM `workshop_posts` WHERE `message` = ?').run(e.message)
                            interaction.editReply({
                                content: "Should be done now!"
                            })  
                        })
                    } else {
                        db.prepare('DELETE FROM `workshop_requests` WHERE `id` = ?').run(e.id)
                        interaction.reply({
                            content: "Should now be deleted!",
                            ephemeral: true
                        })
                    }
                    found = true
                }
            })

            if (found == false) interaction.reply({
                content: "Cannot find post/request",
                ephemeral: true
            })
        }
    }
}