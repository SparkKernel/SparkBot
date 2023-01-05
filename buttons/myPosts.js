const { ActionRowBuilder, EmbedBuilder, Events, StringSelectMenuBuilder } = require('discord.js');

const deletePost = (posts) => {
    var labels = []
    posts.forEach(label => labels.push({label: label.name, description: "Delete post "+label.name, value: label.name}))

    return new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('deletePosts').setPlaceholder('Delete post').addOptions(labels))
}

module.exports = {
    button: {
        id: 'myPosts',
        contains: false
    },
    execute: async(interaction, bot) => {
        const db = bot['db']
        const user = interaction.user.id

        let data = bot['getPosts'](user)
        if (data.length == 0) {
            return interaction.reply({
                content: "You have no current posts.",
                ephemeral: true
            })
        }
        var fields = []
        data.forEach(e => {
            var status = 'Pending...'
            if (e.isPost == true) status='Posted...'
            fields.push({
                name: e.name,
                value: "*Github*: "+e.github+"\n*Status*: "+status,
                inline: true
            })
        })

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Your current posts.")
                    .setDescription("A list of all your current posts(also them in pending)")
                    .addFields(fields)
                    .setColor(16227369)
            ],
            components: [deletePost(data)],
            ephemeral: true
        })
    }
}