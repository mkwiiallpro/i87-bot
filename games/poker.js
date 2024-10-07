// Function to add two variables.
let x = "bababnas"
console.log("bababnas")
let loop = 1
const deck = []
/*
  Cards are represented as integers
  card / 4 + 1 = value (1 = ace, 11 = jack, 12 = queen, 13 = king)
  card % 4 = suit (0 = club, 1 = diamond, 2 = heart, 3 = spade)
  
 */
// The deck starts in order
function card_name(x){
    const value = 1+Math.floor(x/4)
    if(value <= 0) throw "Card number too low"
    if(value > 13) throw "Card number too high"
    const suit = x%4
    let result = ""
    switch(value){
        case 1:
            result += "Ace"
            break;
        case 11:
            result += "Jack"
            break;
        case 12:
            result += "Queen"
            break;
        case 13:
            result += "King"
            break;
        default:
            result += value
            // three cheers for being able to add strings to numbers
            break;
    }
    switch(suit){
        case 0:
            result += " of Clubs"
            break;
        case 1:
            result += " of Diamonds"
            break;
        case 2:
            result += " of Hearts"
            break;
        case 3:
            result += " of Spades"
            break;
    }
    return result
}
for(let i =0; i<52; i++){
    deck.push(i)
}
// Get them shits randomized
for(let i = 0; i<51; i++){
    let j = i+Math.floor(Math.random()*(52-i))
    let temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
}

// Print card names
for(let i =0; i<52; i++){
    console.log(card_name(deck[i]))
}

// Make a Poker Hand
while(loop > 0){

    if(Math.random() < 0.1) {
        loop = 0
    }
    else{
        console.log("ratio")
    }
}
console.log(loop)