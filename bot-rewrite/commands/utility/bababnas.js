const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder().setName("bababnas").setDescription("Bababnas"),
    async execute(interaction){
        await interaction.reply("Bababnas");
    },
};