const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const modal = new ModalBuilder().setCustomId('createPost').setTitle('Create a new post');
const name = new TextInputBuilder().setCustomId('name').setLabel("The name of your post").setStyle(TextInputStyle.Short).setMaxLength(30).setRequired(true);
const description = new TextInputBuilder().setCustomId('description').setLabel("The description of your post").setStyle(TextInputStyle.Paragraph).setMaxLength(500).setRequired(true);
const github = new TextInputBuilder().setCustomId('github').setLabel("The Github URL of your post").setStyle(TextInputStyle.Short).setMaxLength(50).setRequired(true);
const credits = new TextInputBuilder().setCustomId('credits').setLabel("The post credits(not required)").setStyle(TextInputStyle.Short).setMaxLength(50);

const ar=(element) => {return new ActionRowBuilder().addComponents(element)}

modal.addComponents(ar(name),ar(description),ar(github),ar(credits))

module.exports = {
    button: {
        id: 'createPost',
        contains: false
    },
    execute: async(interaction, bot) => interaction.showModal(modal)
    
}