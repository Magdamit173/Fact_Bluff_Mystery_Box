const max_replica = 2
const mystery_collection = [1, 2, 3, 5, -1, -2, -3, -5].flatMap(n => {
    const duplicates = Array.from({ length: max_replica }, () => n)
    return duplicates
})
const replica_collection = []

const groupAName = "Totropahin"
const groupBName = "Titikman"

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
        "text": "Is water a gas at room temperature?",
        "value": false
    },
    {
        "text": "Can humans breathe underwater?",
        "value": false
    },
    {
        "text": "Is the capital of France London?",
        "value": false
    },
    {
        "text": "Do plants require sunlight to grow?",
        "value": true
    },
    {
        "text": "Is the Earth flat?",
        "value": false
    },
    {
        "text": "Are penguins capable of flight?",
        "value": false
    },
    {
        "text": "Does the sun revolve around the Earth?",
        "value": false
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

manifestGroup()

groupA.textContent = groupAName
groupA.addEventListener("click", async () => {
    if (!await confirmPopUp(`Are You Sure ${groupAName}?`, "No", "Yes")) return

    currentGroup = groupAName
    manifestGroup(false)
    await sleep(300)
    manifestQuestionaire()
    questionaireGenerator()
})

groupB.textContent = groupBName
groupB.addEventListener("click", async () => {
    if (!await confirmPopUp(`Are You Sure ${groupBName}?`, "No", "Yes")) return
    currentGroup = groupBName
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

    giveScore(groupScore)
    await sleep(1000)
    manifestMystery(false)
    manifestResult()
})

result_wrapper.addEventListener("click", async () => {
    if (questionaire_collection.length <= 0) {

        if(groupAScore > groupBScore) {
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
        groupAScoreDisplay.textContent = groupAScore
        groupAScoreDisplay.style.animation = borderIndicator(groupAScore, groupBScore)
    }
    else if (currentGroup == groupBName) {
        groupBScore += score
        groupBScoreDisplay.textContent = groupBScore
        groupBScoreDisplay.style.animation = borderIndicator(groupBScore, groupAScore)
    }
}
function giveScore(score) {
    if (currentGroup == groupAName) {
        groupBScore += score
        groupBScoreDisplay.textContent = groupBScore
        groupBScoreDisplay.style.animation = borderIndicator(groupBScore, groupAScore)
    }
    else if (currentGroup == groupBName) {
        groupAScore += score
        groupAScoreDisplay.textContent = groupAScore
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

function choice(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

choice(mystery_collection)