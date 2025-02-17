const max_replica = 2
let mystery_collection = [1, 1, 2, 3, 5, 7, -1, -2, -3, -5, -5, -10].flatMap(n => {
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
        "text": "Sustainable development seeks to meet present needs without compromising the ability of future generations to meet their needs.",
        "value": true
    },
    {
        "text": "Sustainability only focuses on environmental protection, ignoring social and economic factors.",
        "value": false
    },
    {
        "text": "Climate change is one of the challenges that sustainable development addresses.",
        "value": true
    },
    {
        "text": "Resource depletion refers to the overuse of natural resources that leads to scarcity.",
        "value": true
    },
    {
        "text": "Social sustainability is concerned with ensuring access to education, healthcare, and fair labor practices.",
        "value": true
    },
    {
        "text": "Economic sustainability focuses on short-term economic growth and immediate profit.",
        "value": false
    },
    {
        "text": "Science and technology are irrelevant to sustainable development.",
        "value": false
    },
    {
        "text": "Policy integration is essential for long-term sustainability, encouraging green industries and renewable energy.",
        "value": true
    },
    {
        "text": "International cooperation is unnecessary for sustainability, as local solutions are sufficient.",
        "value": false
    },
    {
        "text": "Sustainable technology includes renewable energy sources like solar, wind, and hydroelectric power.",
        "value": true
    },
    {
        "text": "Circular economy promotes waste reduction by encouraging the reuse and recycling of resources.",
        "value": true
    },
    {
        "text": "Biodiversity conservation involves protecting ecosystems, preventing habitat destruction, and maintaining species.",
        "value": true
    },
    {
        "text": "Sustainable consumption refers to using resources irresponsibly, leading to environmental degradation.",
        "value": false
    },
    {
        "text": "Community engagement is vital for the success of sustainability initiatives.",
        "value": true
    },
    {
        "text": "Economic diversification includes moving towards industries like renewable energy and sustainable agriculture.",
        "value": true
    },
    {
        "text": "Biodiversity loss is a challenge that sustainable development tries to prevent.",
        "value": true
    },
    {
        "text": "Sustainable consumption and production practices aim to reduce environmental impact and promote ethical labor practices.",
        "value": true
    },
    {
        "text": "Traditional knowledge, such as sustainable farming, can contribute to more effective sustainability solutions.",
        "value": true
    },
    {
        "text": "The main goal of sustainable development is to balance environmental, social, and economic needs.",
        "value": true
    },
    {
        "text": "Education and public awareness play no role in promoting sustainable lifestyles.",
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
const groupAText = document.querySelector("[data-groupAText]")
const groupBText = document.querySelector("[data-groupBText]")
const groupAInt = document.querySelector("[data-groupAInt]")
const groupBInt = document.querySelector("[data-groupBInt]")
const group_turn = document.querySelector("[data-group_turn]")
const number_pool = document.querySelector("[data-number_pool]")

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
        manifestNumberPool()

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
        manifestNumberPool()

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
    removeNumberPool(groupScore)
    manifestNumberPool(false)

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
    removeNumberPool(groupScore)
    manifestNumberPool(false)

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

        number_pool.replaceChildren()
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
function manifestNumberPool(boolean) {
    if (boolean || boolean === undefined) number_pool.style.display = "flex"
    else number_pool.style.display = "none"
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

function removeNumberPool(compareText) {
    const numberPool = document.querySelector('.number_pool')

    if (numberPool) {
        const children = Array.from(numberPool.children)
        const indexToRemove = children.findIndex(child => parseFloat(child.textContent) === compareText)

        if (indexToRemove !== -1) {
            children.splice(indexToRemove, 1)
            numberPool.innerHTML = ''
            children.forEach(child => numberPool.appendChild(child))
        }
    }
}


// initialized number_pool
mystery_collection.forEach(value => {
    const digit = document.createElement("div")
    digit.setAttribute("class","digit")
    digit.textContent = value

    number_pool.append(digit)
})


function choice(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
