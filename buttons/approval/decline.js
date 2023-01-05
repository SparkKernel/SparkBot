module.exports = {
    button: {
        id: 'declinePost',
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

        interaction.reply({
            content: "You declined post `"+id+"` by user `"+data.user+"`",
            ephemeral: true
        })

        db.prepare('DELETE FROM `workshop_requests` WHERE `id` = ?').run(id)

        interaction.message.delete()
    }
    
}