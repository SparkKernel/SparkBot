const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    command: {
        builder: new SlashCommandBuilder()
            .setName('setup')
            .setDescription('Setup a part of the SparkBot')
            .addSubcommand(sub => sub.setName('github').setDescription('Setup the github-commits channel'))
            .addSubcommand(sub => 
                sub.setName('workshop')
                .setDescription('Setup the workshop')
                .addStringOption(option =>
                    option.setName('type')
                    .setDescription('The type of setup')
                    .setRequired(true)
                    .addChoices(
                        {name: "Create", value: "create"},
                        {name: "Posts", value: "posts"},
                        {name: "Requests", value: "requests"}
                    )
                )
            )
    },
    executors: {
        subs: {
            "github": (interaction, bot) => {
                const user = interaction.user.id
                if (
                    !user == '734006395900264530'
                    || !user == '328447022925479936'
                ) {return}

                const db = bot['db']

                const id = interaction.channelId
                if (id == undefined) {return interaction.reply({
                    content: "Cannot find channel",
                    ephemeral: true
                })}

                let data = db.prepare('SELECT * FROM `github`').get()

                if (data == undefined) {
                    db.prepare('INSERT INTO `github` (`channel`) VALUES (?)').run(id)
                    return interaction.reply({content: "Changed channel from `undefined` > `"+id+'`', ephemeral: true})
                } else {
                    db.prepare('UPDATE `github` SET `channel` = ? WHERE `channel` = ?').run(id, data.channel)
                    return interaction.reply({content: "Changed channel from `"+data.channel+"` > `"+id+'`', ephemeral: true})
                }
            },
            "workshop": (interaction, bot) => {
                const db = bot['db']
                const type = interaction.options.getString('type')
                const id = interaction.channelId
                const user = interaction.user.id

                if (id == undefined) {return interaction.reply({content: "Cannot find channel", ephemeral: true})}

                if (
                    !user == '734006395900264530'
                    || !user == '328447022925479936'
                ) {return}

                let data = db.prepare('SELECT * FROM `workshop_channels` WHERE `type` = ?').get(type)

                if (data == undefined) {
                    db.prepare('INSERT INTO `workshop_channels` (`type`, `channel`) VALUES (?, ?)').run(type, id)
                    interaction.reply({content: "Changed channel(" + type + ") from `undefined` > `"+id+'`', ephemeral: true})
                } else {
                    db.prepare('UPDATE `workshop_channels` SET `channel` = ? WHERE `type` = ?').run(id, type)
                    interaction.reply({content: "Changed channel(" + type + ") from `"+data.channel+"` > `"+id+'`', ephemeral: true})
                }

                bot['updateWorkshop'](interaction, bot, type)
            },
        },
        standard: (interaction, bot) => {}
    }
}