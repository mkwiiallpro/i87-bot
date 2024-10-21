const {SlashCommandBuilder,PermissionFlagsBits} = require('discord.js')
const wait = require('node:timers/promises').setTimeout;
module.exports = {
    data: new SlashCommandBuilder().setName("spoilerwall").setDescription("Counts from 1 to 50 to keep #results spoiler-free!")
    .setDefaultMemberPermissions(0),
    async execute(interaction){
            await interaction.reply("Liftoff will start in T minus 50 seconds");
        for(let i =50; i>-1;i--){
            await interaction.followUp(`${i}`);
            await wait(1_000);
        }
        await interaction.followUp("**Jump to the most recent pin for results!** :rocket:");
    },
};