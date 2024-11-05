const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('elimpath')
		.setDescription('"TWOW may not be ready for such problems." -Paul Erdos').addIntegerOption(option =>
            option.setName('contestants')
                .setDescription('We get there when we get there.')
                .setRequired(true)),
	async execute(interaction) {
        const start = interaction.options.getInteger('contestants');
        if(start < 0){
            await interaction.reply(`Think you're a wiseguy for having negative contesants? No you aren't.`)
        }
        else{
            

            const bababnas = [start];

            let temp = start;
            while(temp != 1){
                if(temp % 2 === 0){
                    temp = Math.floor(temp / 2)
                    //console.log(temp)
                }
                else{
                    temp = 1 + 3* temp
                    //console.log(temp)
                }
                bababnas.push(temp)
                
            }
            
            let line_one = `Your TWOW will last **${bababnas.length-1}** rounds, and here's how they'll go:\n`
            let line_two = ""

            for(let i = 0; i<bababnas.length; i++){
                let number = bababnas[i]

                line_two += `**${number}**`
                if(number !== 1) line_two += " > "
                else{
                    line_two += '\n\n'
                }
            }
            if(line_two.length > 1800){
                line_two = line_two.substring(0,1800) + " ... > **1**\n\n"
            }
            let line_three = "Consider this: Bababnas"
		    await interaction.reply({ content: line_one+line_two+line_three, ephemeral: false });
        }
        
	},
};