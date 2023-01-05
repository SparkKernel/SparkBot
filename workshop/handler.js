const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders")
const { ButtonStyle } = require("discord.js")

const data = {
    "create": {
        embed: new EmbedBuilder()
            .setTitle('Create a new post!')
            .setDescription("So, if you wan't to post your very own script on the workshop, this is the right place.\nBut, please read our workshop rules - and what we expect from you.")
            .setColor(15769101)
            .addFields(
                {name: "Owner", value: "To be able to request your post on the workshop, you need to own the script. So have some sort of proof that you made it. If its not your script entirely, please note and make them aware that you requested this on the workshop."},
                {name: "Framework", value: "The script needs to be made using Sparkling, if not - it  will  be rejected."},
                {name: "Link", value: "If you have links, please remember that if these links is __unsafe__ your application will be declined, and you will face the consequences."},
                {name: "Github", value: "Your script needs to be public on Github, and the link of the repo needs to be provided in the application under \"Github URL\". If not, your request will be declined."}
            ),
        buttons: new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('createPost')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('🔨 Create post'),
                    new ButtonBuilder()
                        .setCustomId('myPosts')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('🧍 My posts'),
                )
    }
}

module.exports = (interaction, bot, type) => {
    if (data[type] == null) {return}
    const channel = interaction.channel
    channel.send({
        embeds: [data[type].embed],
        components: [data[type].buttons]
    })
}