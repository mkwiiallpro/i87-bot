const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordcount')
		.setDescription('Takes a message and returns its word (and character) count with regards to TWOW').addStringOption(option =>
            option.setName('response')
                .setDescription('Go get em, slugger.')
                .setRequired(true)),
	async execute(interaction) {
        const response = interaction.options.getString('response');
        const words = response.split(" ").length;
        const characters = response.length;
		await interaction.reply({ content: `This response is ${words} word(s) and ${characters} character(s).`, ephemeral: true });
	},
};