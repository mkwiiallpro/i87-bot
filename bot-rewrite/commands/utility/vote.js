const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Cast a vote in MarisaTWOW. Current Round: -1').addStringOption(option =>
            option.setName('screen')
                .setDescription('Current Screens: TBD, so vote on any screen you want.')
                .setRequired(true))
                .addStringOption(option => 
                    option.setName('vote')
                    .setDescription(`If you alphabet vote, I'll kill you.`)
                    .setRequired(true))
                ,
	async execute(interaction) {
        const screen = interaction.options.getString('screen');
        console.log(screen.toUpperCase)
        const vote = interaction.options.getString('vote')
        // TODO: Lookup active screens in the database
        const count = []
        const missing = []
        const duplicate = []
        const bad = []
        let result = ""
        if(screen === "hello" || screen === "HELLO"){
            result = "ERROR: "+screen+" is not a valid keyword."
        }
        else if(screen.length === 0){
            result = "ERROR: no screen name was provided"
        }
        else{
            // LOOP 1: Initialize count
            for(let i =0; i<10; i++){
                count.push(0)
            }
            
            // LOOP 2: Check for good/bad letters
            for(let i =0 ;i<vote.length; i++){
                let temp = vote.charCodeAt(i) - 65
                if(temp >= 10 || temp <0){
                    bad.push(vote.at(i))
                }
                else{
                    count[temp]++
                }
            }
            
            // LOOP 3: Check for missing/duplicate letters
            for(let i =0; i<count.length;i++){
                if(count[i] === 0){
                    missing.push(String.fromCharCode(i+65))
                }
                if(count[i] >1 ){
                    duplicate.push(String.fromCharCode(i+65))
                }
            }

            // Print it all
            if(missing.length >0){
                result += "MISSING LETTERS: "
                for(let i =0; i<missing.length;i++){
                    result += (i+1===missing.length)?missing[i]+"\n":missing[i]+", "
                }
            }
            if(duplicate.length >0){
                result += "DUPLICATE LETTERS: "
                for(let i =0; i<duplicate.length;i++){
                    result += (i+1===duplicate.length)?duplicate[i]+"\n":duplicate[i]+", "
                }
            }
            if(bad.length >0){
                result += "BAD LETTERS: "
                for(let i =0; i<bad.length;i++){
                    result += (i+1===bad.length)?bad[i]+"\n":bad[i]+", "
                }
            }
            
        }
        
        
        // Check for missing, duplicate or bad letters
        // TODO: Check if the user has already voted 
        if(result.length === 0){
            result = "Vote Received"
        }
        if(result.length >0){
            await interaction.reply(`${result}`);
        }
        else{
            await interaction.reply(`ERROR: Something happened`)
        }
		
	},
};