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

function hand_name(x){
    if(x.length != 5) throw "Array wrong size"
    const sorted = x.toSorted(function(a, b){return a - b}) // Sorts by value (aces low)
    /*Hand Rankings
      Royal Flush: Ace high Straight Flush
      Straight Flush: 5 consecutive suited cards, phrased as "X High Straight Flush"
      Four of a kind: 4 of one value, phrased as "Quad Xs"
      Full House/Boat: 3 of value X, 2 of value Y, phrased as "Xs full of Ys"
      Flush: 5 suited cards, phrased as "X High Flush"
      Straight: 5 consecutive cards, phrased as "X High Straight"
      Three of a Kind: 3 of one value, phrased as "Three Xs" (TODO: difference between trips and a set)
      Two Pair: 2 of value X, 2 of value Y, phrased as "Two Pair, Xs and Ys"
      One Pair: 2 of one value, 3 unique cards, phrased as "Pair of Xs"
      High Card: 5 unsuited unconnected cards, phrased as "X high" (TODO: code in lowball poker)
     */
    let flush = true
    const suit = sorted[0] % 4
    for(let i =1; i<5;i++){
        if(sorted[i] % 4 != suit){ 
            flush = false
            break
        }
    }
    let straight = 0 // Highest value in the straight
    const values = [-1,-1,-1,-1,-1]
    const amt = [0,0,0,0,0,0,0,0,0,0,0,0,0,0] // Poorman hash table 
    let high_card =0
    for(let i =0; i<5; i++){
 
        values[i] = 1+Math.floor(sorted[i]/4)
        amt[values[i]]++
        if(values[i] > high_card) high_card = values[i]
    }   
    if(amt[1] > 0) high_card =1

    if(values[0] === 1 && values[1]== 10){ // Check for Ace High Straights
        if(values[2]=== 11 && values[3] === 12 && values[4] === 13){
            straight = 1
        }
    } 
    else{ // Check for all other straights
        for(let i =1; i<5; i++){
      
            if(values[i]-1 != values[i-1]) break;
            if(i=== 4) straight = values[4]
        }
    }
    // High Card
    let result = ""
    switch(high_card){
        case 1:
            result = "Ace High"
            break;
        case 13:
            result = "King High"
            break;
        case 12:
            result = "Queen High"
            break;
        case 11:
            result = "Jack High"
            break;
        default:
            result = high_card + " High"
            break;
    }
    // Tuples
    let quads = amt.indexOf(4)
    switch(quads){
        case 1:
            return "Quad Aces"
            break;
        case 11:
            return "Quad Jacks"
            break;
        case 12:
            return "Quad Queens"
            break;
        case 13:
            return "Quad Kings"
            break;
        case -1:
            break;
        default:
            result = "Quad "+quads+"s"
            return result
            break;
    }
    let trips = amt.indexOf(3)
    let pair = amt.indexOf(2)
    if(trips != -1 && pair != -1){ // Full Houses
        result = ""
        switch(trips){
            case 1:
                result = "Aces full of"
                break;
            case 11:
                result = "Jacks full of"
                break;
            case 12:
                result=  "Queens full of"
                break;
            case 13:
                result= "Kings full of"
                break;
            default:
                result = trips+"s full of"
                break;
        }
        switch(pair){
            case 1:
                result += " Aces"
                break;
            case 11:
                result += " Jacks"
                break;
            case 12:
                result+=  " Queens"
                break;
            case 13:
                result+= " Kings"
                break;
            default:
                result += " "+pair+"s"
                break;
        }
        return result
    }
    // 3 of a kind
    if(trips != -1 && pair === -1){
        switch(trips){
            case 1:
                result = "Three Aces"
                break;
            case 11:
                result = "Three Jacks"
                break;
            case 12:
                result=  "Three Queens"
                break;
            case 13:
                result= "Three Kings"
                break;
            default:
                result = "Three "+trips+"s"
                break;
        }
        return result
    }
    let pair2 = amt.lastIndexOf(2)
    // 2 pair and 1 pair
    if(pair != -1){
        if(pair2 === pair){ // 1 pair
            switch(pair){
                case 1:
                    result = "Pair of Aces"
                    break;
                case 11:
                    result = "Pair of Jacks"
                    break;
                case 12:
                    result=  "Pair of Queens"
                    break;
                case 13:
                    result= "Pair of Kings"
                    break;
                default:
                    result = "Pair of "+pair+"s"
                    break;
            }
            return result
        }
        else{// 2 pair
            switch(pair){
                case 1:
                    result = "Two Pair, Aces"
                    break;
                case 11:
                    result = "Two Pair, Jacks"
                    break;
                case 12:
                    result=  "Two Pair, Queens"
                    break;
                case 13:
                    result= "Two Pair, Kings"
                    break;
                default:
                    result = "Two Pair, "+pair+"s"
                    break;
            }
            switch(pair2){
                case 1:
                    result += " and Aces"
                    break;
                case 11:
                    result += " and Jacks"
                    break;
                case 12:
                    result+=  " and Queens"
                    break;
                case 13:
                    result+= " and Kings"
                    break;
                default:
                    result += " and "+pair2+"s"
                    break;
            }
            return result
        }
    }

    // Straights and Flushes
    if(flush){
        if(straight === 1){ 
            return "Royal Flush"
        }
        else if(straight === 5){
            return "5 high Straight Flush"
        }
        else if(straight >1 ){
            result += " Straight Flush"
        }
        else{
            result += " Flush"
        }

    }
    else if(straight > 0){
        result += " Straight"
    }
    return result
}

for(let i =0; i<52; i++){
    deck.push(i)
}
// Shuffle
for(let i = 0; i<51; i++){
    let j = i+Math.floor(Math.random()*(52-i))
    let temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
}

// Print card names

// Make a Poker Hand using array[0] through array[4] inclusive
const hand = [40, 8, 20, 16, 0]
for(let i =0; i<5; i++){
    console.log(hand[i] + " is equal to "+card_name(hand[i]))
}
console.log("----------")
console.log(hand_name(hand))

/*TODO: 
    Hand Sorting
    Best Hand from N > 5 Cards
    Fully-Functional Poker Game
    Toss it into the bot
     */
console.log(loop)