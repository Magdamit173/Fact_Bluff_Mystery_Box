const max_replica = 2
let mystery_collection = [1, 2, 3, 5, -1, -2, -3, -5].flatMap(n => {
    const duplicates = []
    for (let i = 0; i < max_replica; ++i) {
        if (n > 0) duplicates.push(n)
        else return n
    }
    return duplicates
})
const replica_collection = []

const groupAName = "Group A"
const groupBName = "Group B"

let active_popup = null

let groupAScore = 0
let groupBScore = 0

// reset at once
let currentGroup = null
let chosenValue = null
let questionValue = null
let currentQuestion = null
let isDrawable = false

const group_wrapper = document.querySelector("[data-group_wrapper]")
const questionaire_wrapper = document.querySelector("[data-questionaire_wrapper]")
const mysterious_wrapper = document.querySelector("[data-mysterious_wrapper]")
const result_wrapper = document.querySelector("[data-result_wrapper]")


const questionaire_collection = [
    {
        "text": "Scuba diving enables individuals to explore the underwater world by wearing special equipment that allows them to breathe underwater.",
        "value": true
    },
    {
        "text": "Scuba diving involves wearing heavy metal boots to sink to the bottom of the ocean quickly.",
        "value": false
    },
    {
        "text": "Scuba diving requires specialized training and certification to ensure safety underwater, including learning about equipment operation, safety procedures, and diving physics.",
        "value": true
    },
    {
        "text": "Scuba diving certification includes a module on underwater navigation, where divers are taught to use celestial bodies such as stars and the moon to orient themselves underwater.",
        "value": false
    }, {
        "text": "Scuba diving involves using special underwater suits made of bubble wrap for protection against marine creatures.",
        "value": false
    },
    {
        "text": "Scuba diving provides a unique opportunity to witness breathtaking underwater landscapes, encounter diverse marine life, and explore submerged shipwrecks and coral reefs.",
        "value": true
    },
    {
        "text": "Some advanced scuba diving techniques involve harnessing bio-luminescent algae to illuminate dark underwater caves, creating a mesmerizing and otherworldly experience for divers.",
        "value": false
    },
    {
        "text": "Scuba diving involves wearing a mask, fins, and a buoyancy control device (BCD) along with a tank of compressed air",
        "value": true
    }
]



const groupA = document.querySelector("[data-groupA]")
const groupB = document.querySelector("[data-groupB]")
const fact = document.querySelector("[data-fact]")
const bluff = document.querySelector("[data-bluff]")
const score = document.querySelector("[data-score]")
const questionaire = document.querySelector("[data-questionaire]")
const answer_queue = document.querySelector("[data-answer_queue]")
const take = document.querySelector("[data-take]")
const give = document.querySelector("[data-give]")
const groupAScoreDisplay = document.querySelector("[data-groupAScoreDisplay]")
const groupBScoreDisplay = document.querySelector("[data-groupBScoreDisplay]")
const groupAText = document.querySelector("[data-groupAText]")
const groupBText = document.querySelector("[data-groupBText]")
const groupAInt = document.querySelector("[data-groupAInt]")
const groupBInt = document.querySelector("[data-groupBInt]")
const group_turn = document.querySelector("[data-group_turn]")

manifestGroup()
// manifestResult()

groupA.textContent = groupAName
groupAText.textContent = groupAName
groupA.addEventListener("click", async () => {
    if (!await confirmPopUp(`Are You Sure ${groupAName}?`, "No", "Yes")) return

    currentGroup = groupAName
    groupTurn(currentGroup)
    manifestGroup(false)
    await sleep(300)
    manifestQuestionaire()
    questionaireGenerator()
})

groupB.textContent = groupBName
groupBText.textContent = groupBName
groupB.addEventListener("click", async () => {
    if (!await confirmPopUp(`Are You Sure ${groupBName}?`, "No", "Yes")) return

    currentGroup = groupBName
    groupTurn(currentGroup)
    manifestGroup(false)
    await sleep(300)
    manifestQuestionaire()
    questionaireGenerator()
})

fact.addEventListener("click", async () => {
    if (!await confirmPopUp(`Is "Fact" Your final Answer?`, "No", "Yes")) return
    chosenValue = true
    manifestQuestionaire(false)

    if (chosenValue == questionValue) {
        answerQueue("Correct!", true, true)
        await sleep(1000)
        answerQueue("", false)
        questionaire_collection.splice(questionaire_collection.indexOf(currentQuestion), 1)
        // questionaire_collection.filter(item => item !== currentQuestion)

        manifestMystery()
        mysteryGenerator()
    }
    else {
        groupTurn()

        answerQueue("Wrong!", true, false)
        await sleep(1000)
        answerQueue("", false)
        manifestGroup()
    }
})

bluff.addEventListener("click", async () => {
    if (!await confirmPopUp(`Is "Bluff" Your final Answer?`, "No", "Yes")) return
    chosenValue = false
    manifestQuestionaire(false)

    if (chosenValue == questionValue) {
        answerQueue("Correct!", true, true)
        await sleep(1000)
        answerQueue("", false)
        questionaire_collection.splice(questionaire_collection.indexOf(currentQuestion), 1)
        // questionaire_collection.filter(item => item !== currentQuestion)

        manifestMystery()
        mysteryGenerator()
    }
    else {
        groupTurn()

        answerQueue("Wrong!", true, false)
        await sleep(1000)
        answerQueue("", false)
        manifestGroup()
    }
})

take.addEventListener("click", async () => {
    if (isDrawable == false) return
    if (!await confirmPopUp(`Are You Sure to Take?`)) return
    isDrawable = false

    const groupScore = choice(mystery_collection)
    score.textContent = groupScore
    spliceAtFirstOccurrence(mystery_collection, groupScore)

    takeScore(groupScore)
    await sleep(1000)
    manifestMystery(false)
    manifestResult()
})

give.addEventListener("click", async () => {
    if (isDrawable == false) return
    if (!await confirmPopUp(`Are You Sure to Give?`)) return
    isDrawable = false

    const groupScore = choice(mystery_collection)
    score.textContent = groupScore
    spliceAtFirstOccurrence(mystery_collection, groupScore)

    giveScore(groupScore)
    await sleep(1000)
    manifestMystery(false)
    manifestResult()
})

result_wrapper.addEventListener("click", async () => {
    if (questionaire_collection.length <= 0) {
        groupTurn()

        if (groupAScore > groupBScore) {
            answerQueue(`${groupAName} Wins! Score: ${groupAScore}\n ${groupBName}'s Score: ${groupBScore} `)
        }
        else if (groupBScore > groupAScore) {
            answerQueue(`${groupBName} Wins! Score: ${groupBScore}\n ${groupAName}'s Score: ${groupAScore} `)
        }
        else if (groupAScore == groupBScore) {
            answerQueue(`Draw! Score: ${(groupBScore + groupAScore) / 2}`)
        }

        answer_queue.style.animation = borderIndicator(1, 0)
        manifestResult(false)
        resetIndicator(groupAScoreDisplay, groupBScoreDisplay)
    }
    else if (await confirmPopUp("You Sure Wanna Pick Group?", "No", "Yes")) {
        groupTurn()
        manifestResult(false)
        manifestGroup()
        resetIndicator(groupAScoreDisplay, groupBScoreDisplay)
    }
})

function manifestGroup(boolean) {
    if (boolean || boolean === undefined) group_wrapper.style.display = "flex"
    else group_wrapper.style.display = "none"
}
function manifestQuestionaire(boolean) {
    if (boolean || boolean === undefined) questionaire_wrapper.style.display = "flex"
    else questionaire_wrapper.style.display = "none"
}
function manifestMystery(boolean) {
    if (boolean || boolean === undefined) mysterious_wrapper.style.display = "flex"
    else mysterious_wrapper.style.display = "none"
}
function manifestResult(boolean) {
    if (boolean || boolean === undefined) result_wrapper.style.display = "flex"
    else result_wrapper.style.display = "none"
}

function questionaireGenerator() {
    currentQuestion = choice(questionaire_collection)
    questionValue = currentQuestion.value
    questionaire.textContent = currentQuestion.text
}

function mysteryGenerator() {
    let count = 0
    let max_count = 20
    const interval = setInterval(() => {
        count += 1
        if (count >= max_count) {
            clearInterval(interval)
            score.textContent = "?"
            isDrawable = true
        }
        else score.textContent = choice(mystery_collection)
    }, 100)
}

function answerQueue(text, boolean, color) {
    if (boolean || boolean === undefined) {
        answer_queue.textContent = text
        answer_queue.style.display = "flex"
    }
    else {
        answer_queue.textContent = "?"
        answer_queue.style.display = "none"
    }

    if (color === true) {
        answer_queue.style.backgroundColor = "skyblue"
    }
    else if (color === false) {
        answer_queue.style.backgroundColor = "rgb(255, 45, 45)"
    }
    else answer_queue.style.backgroundColor = "inherit"
}

function takeScore(score) {
    if (currentGroup == groupAName) {
        groupAScore += score
        groupAInt.textContent = groupAScore
        groupAScoreDisplay.style.animation = borderIndicator(groupAScore, groupBScore)
    }
    else if (currentGroup == groupBName) {
        groupBScore += score
        groupBInt.textContent = groupBScore
        groupBScoreDisplay.style.animation = borderIndicator(groupBScore, groupAScore)
    }
}
function giveScore(score) {
    if (currentGroup == groupAName) {
        groupBScore += score
        groupBInt.textContent = groupBScore
        groupBScoreDisplay.style.animation = borderIndicator(groupBScore, groupAScore)
    }
    else if (currentGroup == groupBName) {
        groupAScore += score
        groupAInt.textContent = groupAScore
        groupAScoreDisplay.style.animation = borderIndicator(groupAScore, groupBScore)
    }
}

function borderIndicator(value, comparevalue) {
    if (value >= comparevalue) return "skyIndicator 1s linear infinite"
    else return "redIndicator 1s linear infinite"
}
function resetIndicator(...elements) {
    for (let element of elements) {
        element.style.animation = ""
    }
}

function groupTurn(text) {
    if (text) group_turn.textContent = `${text}'s Turn`
    else group_turn.textContent = `No one's Turn`
}

function choice(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
