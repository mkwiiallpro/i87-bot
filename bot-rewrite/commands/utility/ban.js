const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder().setName("ban").setDescription("Bans the selected user and gives a reason.")
    .addUserOption(option => option.setName('target').setDescription('Who we targeting today?').setRequired(true))
            .addStringOption(option => 
                option.setName('reason')
                .setDescription(`Hopefully this ends well.`)
                .setRequired(false)).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction){
        console.log(interaction.options.getUser('target')) // NOTE: interaction.options is plural! interaction.option is undefined
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No Reason'; // NOTE: getString !== getStringOption
        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Ban')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

		const response = await interaction.reply({ // NOTE: This exists
			content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
			components: [row],
		});
        const collectorFilter = i => i.user.id === interaction.user.id;

    try {
    	const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'confirm') {
            await interaction.guild.members.ban(target);
            await confirmation.update({ content: `${target.username} has been banned for reason: ${reason}`, components: [] });
        } else if (confirmation.customId === 'cancel') {
            await confirmation.update({ content: 'Action cancelled', components: [] });
        }
    } 
    catch (e) {
        console.log(e)
	    await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }

        
    },
};