// TODO: Rewriting all my C/C++ TWOW utilities in JS
// TODO: CSV Parsing


// Helper Functions
function screen_maker(all_responses,size,seed){
    
    buffer = parseInt(Math.abs(seed))
    if(buffer=== NaN){
        console.log("ERROR: Seed not an integer")
        return -1
    }
    if(size < 7){
        console.log("ERROR: Section size too small")
        return -1
    }
    if(size > all_responses.length){
        console.log("ERROR: Section size too big")
        return -1
    }
    const a = 25214903917
    const c = 11
    const m = 281474976710656
    const screens = Math.floor(all_responses.length / size) // Not all screen sizes can be honored. We round up to whatever's feasible.
    const pre_result = all_responses.slice() // const result will be an object containing a 2d array
    for(let i =0; i<= pre_result.length-2;i++){
        buffer = (buffer* a + c)% m
        let j = i+Math.floor((buffer/m)*(pre_result.length-i))
        let temp = pre_result[i]
        pre_result[i] = pre_result[j]
        pre_result[j] = temp
    }
    const result = []
    for(let i =0; i<screens;i++){
        result.push([])
    }
    for(let i =0; i<pre_result.length;i++){
        result[i%screens].push(pre_result[i])
    }
    let sn= seed + "-" + size
    const result_2 = {section_name:sn, screens: result}
    return result_2
}

function print_section(section){
    const all_responses = section.screens
    const name = section.section_name
    for(let i =0; i<all_responses.length;i++){
        console.log("--- "+name+"-"+i+ " ---")
        for(let j = 0; j<all_responses[i].length;j++){
            // TODO: Make the word/character limit thing better
            let letter = String.fromCharCode(65+j) // TODO: Skip ASCII 91 and 93 to prevent ambiguity with brackets
            const words = all_responses[i][j].split(" ").length;
            const final_char = (words>10)?"("+words+" words)":""
            
            console.log(letter + "\t" + all_responses[i][j]+ "\t"+ final_char)
        }
        console.log("--------------------")
    }
}
function check_vote(vote,size){
    if(vote.at(0) !== "[" || vote.at(-1) !== "]"){
        return "ERROR: Missing Bracket(s)"
    }
    const both_sides = vote.split(" ")
    if(both_sides.length !== 2){
        return "ERROR: Wrong number of spaces"
    }
    let keyword =both_sides[0]
    // TODO: Keyword Checking

    let letters = both_sides[1].substr(0,both_sides[1].length-1)
    const counts = []
    const bad = []
    for(let i =0;i<size;i++){
        counts.push(0)
    }
    for(let i =0;i<letters.length;i++){
        let temp = letters.charCodeAt(i)-65
        if(temp>= size){
            bad.push(letters.at(i))
        }
        else counts[temp]++ 
    }
    // Letter Checking
    const missing = []
    const multiple = []
    for(let i =0;i<size;i++){
        if(counts[i] === 0){
            missing.push(String.fromCharCode(65+i))
        }
        if(counts[i] >1){
            multiple.push(String.fromCharCode(65+i))
        }
    }
    let result = ""
    if(missing.length >0){
        result += "MISSING LETTERS: "
        for(let i =0; i<missing.length;i++){
            result += (i+1===missing.length)?missing[i]+"\n":missing[i]+", "
        }
    }
    if(multiple.length >0){
        result += "DUPLICATE LETTERS: "
        for(let i =0; i<multiple.length;i++){
            result += (i+1===multiple.length)?multiple[i]+"\n":multiple[i]+", "
        }
    }
    if(bad.length >0){
        result += "BAD LETTERS: "
        for(let i =0; i<bad.length;i++){
            result += (i+1===bad.length)?bad[i]+"\n":bad[i]+", "
        }
    }
    
    if(result.length >0) return result
    else return ""
}
function random_vote(screen_name,size){
    const result = []
    for(let i =0; i<size; i++){
        result.push(String.fromCharCode(65+i));
    }
    for(let i =0; i<=size-2;i++){
        let j = i+Math.floor(Math.random()*(size-i))
        let temp = result[i]
        result[i] = result[j]
        result[j] = temp
    }
    let result_2 = ""
    for(let i =0; i<size; i++){
        result_2+= result[i]
    }
    return "["+screen_name+" "+result_2+"]"
}
// Main Data Structures

let responses = []

const fs = require("fs")
const buf = Buffer.alloc(999999)
const readline = require("readline")
try { 
    const data = fs.readFileSync('input.txt', 'utf8');
   // console.log(data);
   // TODO: Find a way to deal with exact duplicate responses, probably by appending one with a zero-width space 
   // TODO: Windows to Unix string conversion
    responses= data.toString().split('\r\n')
  } catch (err) {
    console.error(err);
  }


// FOR TESTING THE SYNCHRONOUS READ
/*for(let i =0; i<491;i++){ 
    console.log(i + "\t" + responses[i])
}*/


print_section(screen_maker(responses,16,1111)) // Again, screen size isn't always respected. It happens.


const results = new Map()
for(let i =0; i<responses.length;i++){
    results.set(responses[i],[]) // All repsonses start with zero votes. Just doing this in advance so I don't need to do it later.
}

const votes = ["[420-69-3 BABABNAS]","[1111-11-1 ABCEFGH]","[BABABNAS THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG]"]
for(let i =0; i<10; i++){
    votes.push(random_vote("592-8-0",8))
    votes.push(random_vote("592-8-1",8))
    votes.push(random_vote("16384-16-0",16))
}
for(let i =0; i<votes.length;i++){
    let vote = votes[i]
    console.log(vote)
    console.log(check_vote(vote,8))
}
//console.log(votes)

// TODO: Open another file and parse votes

// Results Calculation