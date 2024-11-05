const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')
const wait = require('node:timers/promises').setTimeout;
module.exports = {
    data: new SlashCommandBuilder().setName("baccarat").setDescription("Bet The Tie:tm:").addIntegerOption(option =>
        option.setName('wager')
            .setDescription('Feel free to wager negative money, coward.')
            .setRequired(true)),
    async execute(interaction){
        let bet_id = 0
        const player = []
        let player_score = 0
        const banker = []
        let banker_score = 0
        const wager = interaction.options.getInteger('wager');
        const bet_player = new ButtonBuilder()
        .setCustomId('bet_player')
        .setLabel('Player (1:1)')
        .setStyle(ButtonStyle.Success);

        const bet_banker = new ButtonBuilder()
        .setCustomId('bet_banker').setLabel('Banker (0.95:1)').setStyle(ButtonStyle.Danger);

        const bet_tie = new ButtonBuilder().setCustomId('bet_tie').setLabel('Tie (9:1)').setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
			.addComponents(bet_player,bet_tie, bet_banker);

        
        const response = await interaction.reply({
            content: `Let's Go Gambling!`,
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        
            if (confirmation.customId === 'bet_player') {
                await confirmation.update({ content: 'Awesome! Closest to nine wins, tens and face cards equal zero.', components: [] });
                bet_id =1
            } 
            else if (confirmation.customId === 'bet_banker') {
                await confirmation.update({ content: 'Wise choice. Closest to nine wins, tens and face cards equal zero.', components: [] });
                bet_id =2
            }
            else if (confirmation.customId === 'bet_tie') {
                await confirmation.update({ content: 'You are a degenerate gambler. Go home.', components: [] });
                bet_id = 3
            }
        } catch (e) {
            await interaction.editReply({ content: 'You snooze you lose! Maybe place your bet within a minute next time, okay?', components: [] });
        }
        await wait(1_000)
        // Necessary Data Structures
        const values = ["A","2","3","4","5","6","7","8","9","T","J","Q","K"]
        const internal_values = [1,2,3,4,5,6,7,8,9,0,0,0,0]
        const suits = [":clubs:",":diamonds:",":hearts:",":spades:"]
        const t3 = [true, true, true, true, true, true, true, true, false, true]
        const t4 = [false, false, true, true, true, true, true, true, false, false]
        const t5 = [false, false, false, false, true, true, true, true, false, false]
        const t6 = [false, false, false ,false ,false ,false, true, true, false, false]
        const tableau_full = [t3,t4,t5,t6]
        // Card 1
        let line_one = "Player: "
        let line_two = "Banker: "
        player.push(Math.floor(Math.random() * 52))

        line_one = line_one + values[(player[0] % 13)] + suits[Math.floor(player[0]/13)]
        player_score += internal_values[(player[0] % 13)]
        await interaction.editReply({ content: line_one + "\n" +line_two + "\n", components: [] });
        await wait(1_000)

        // Card 2
        banker.push(Math.floor(Math.random() * 52))
        line_two = line_two+  values[(banker[0] % 13)] + suits[Math.floor(banker[0]/13)]
        banker_score += internal_values[banker[0]%13]
        await interaction.editReply({ content: line_one + "\n" +line_two + "\n", components: [] });
        await wait(1_000)

        // Card 3
        player.push(Math.floor(Math.random() * 52))
        line_one = line_one + values[(player[1] % 13)] + suits[Math.floor(player[1]/13)]
        player_score += internal_values[player[1]%13]
        await interaction.editReply({ content: line_one + "\n" +line_two + "\n", components: [] });
        await wait(1_000)

        // Card 4
        banker.push(Math.floor(Math.random() * 52))
        line_two = line_two+  values[(banker[1] % 13)] + suits[Math.floor(banker[1]/13)]
        banker_score += internal_values[banker[1]%13]
    
        // reset scores
        player_score = player_score % 10
        banker_score = banker_score % 10

        console.log("4 cards: "+player_score + " vs "+banker_score)
        let line_three = ""
        
        // Check for results
        // TODO: punto banco table
        if(player_score > 7 || banker_score > 7){ // If either player has an 8 or 9, end the game here.
            if(player_score > banker_score){
                line_three = "Player Wins "+player_score+" to "+banker_score
                if(bet_id === 1){
                    line_three += " (+$"+wager+")"
                }
                else{
                    line_three += " (-$"+wager+")"
                }
            }
            else if(banker_score > player_score){
                line_three = "Banker Wins "+banker_score+" to "+player_score
                if(bet_id === 2){
                    line_three += " (+$"+wager*0.95+")"
                }
                else{
                    line_three += " (-$"+wager+")"
                }
            }
            else{
                line_three = "Tie Bets Win "+banker_score+" to "+player_score
                if(bet_id === 1){
                    line_three += " (+$"+wager*9+")"
                }
                else{
                    line_three += " (push)"
                }
            }
            await interaction.editReply({ content: line_one + "\n" +line_two + "\n\n" + line_three, components: [] });
        }
        else{ // Someone has a lower number
            line_three = "Consulting Tableau..."
            await interaction.editReply({ content: line_one + "\n" +line_two + "\n\n" + line_three, components: [] });
            await wait(1_000)

            // Card 5 (if needed)
            if(player_score <= 5){ // Player Hits
                player.push(Math.floor(Math.random() * 52))
                line_one = line_one + values[(player[2] % 13)] + suits[Math.floor(player[2]/13)]
                player_score += internal_values[player[2]%13]
                player_score = player_score % 10
                await interaction.editReply({ content: line_one + "\n" +line_two + "\n\n" + line_three, components: [] });
                await wait(1_000)
                // Card 6 (if needed)
                if(banker_score <=2 ){ // Banker Always Hits on 2-
                    banker.push(Math.floor(Math.random()*52))
                    line_two = line_two+  values[(banker[2] % 13)] + suits[Math.floor(banker[2]/13)]
                    banker_score += internal_values[banker[2]%13]
                    banker_score = banker_score % 10
                }
                else if(banker_score > 2&&banker_score < 7 && tableau_full[banker_score-3][player_score]){ // Banker Always Stands on 7
                    banker.push(Math.floor(Math.random()*52))
                    line_two = line_two+  values[(banker[2] % 13)] + suits[Math.floor(banker[2]/13)]
                    banker_score += internal_values[banker[2]%13]
                    banker_score = banker_score % 10
                }
            }
            else{ // Player Stands, Banker Plays by Player Rule
                if(banker_score <=5 ){
                    banker.push(Math.floor(Math.random()*52))
                    line_two = line_two+  values[(banker[2] % 13)] + suits[Math.floor(banker[2]/13)]
                    banker_score += internal_values[banker[2]%13]
                    banker_score = banker_score % 10

                }
            }
            
            // Final Calculation
            
            if(player_score > banker_score){
                line_three = "Player Wins "+player_score+" to "+banker_score
                if(bet_id === 1){
                    line_three += " (+$"+wager+")"
                }
                else{
                    line_three += " (-$"+wager+")"
                }
            }
            else if(banker_score > player_score){
                line_three = "Banker Wins "+banker_score+" to "+player_score
                if(bet_id === 2){
                    line_three += " (+$"+wager*0.95+")"
                }
                else{
                    line_three += " (-$"+wager+")"
                }
            }
            else{
                line_three = "Tie Bets Win "+banker_score+" to "+player_score
                if(bet_id === 1){
                    line_three += " (+$"+wager*9+")"
                }
                else{
                    line_three += " (push)"
                }
            }
            await interaction.editReply({ content: line_one + "\n" +line_two + "\n\n" + line_three, components: [] });
        }
    },
};