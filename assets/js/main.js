const max_replica = 2
const mystery_collection = [1, 2, 3, 5, -1, -2, -3, -5].flatMap(n => {
    const duplicates = Array.from({ length: max_replica }, () => n)
    return duplicates
})
let active_popup = null

let groupAScore = 0
let groupBScore = 0

// reset at once
let currentGroup = null
let chosenValue = null
let questionValue = null
let isDrawable = false

const replica_collection = []
const group_wrapper = document.querySelector("[data-group_wrapper]")
const questionaire_wrapper = document.querySelector("[data-questionaire_wrapper]")
const mysterious_wrapper = document.querySelector("[data-mysterious_wrapper]")
const result_wrapper = document.querySelector("[]")


const questionaire_collection = [{
    "text": "ARe dog all cats",
    "value": false
}, {
    "text": "is Apple Tree small?",
    "value": false
}, {
    "text": "is the highest mountain named mt everest?",
    "value": true
}, {
    "text": "Are birds has wings?",
    "value": true
}]


const groupA = document.querySelector("[data-groupA]")
const groupB = document.querySelector("[data-groupB]")
const fact = document.querySelector("[data-fact]")
const bluff = document.querySelector("[data-bluff]")
const score = document.querySelector("[data-score]")
const questionaire = document.querySelector("[data-questionaire]")
const answer_queue = document.querySelector("[data-answer_queue]")
const take = document.querySelector("[data-take]")
const give = document.querySelector("[data-give]")

manifestGroup()

groupA.addEventListener("click",async () => {
    if(!await confirmPopUp(`Are You Sure Totropahin?`, "No", "Yes")) return

    currentGroup = "A"
    manifestGroup(false)
    await sleep(300)
    manifestQuestionaire()
    questionaireGenerator()
})

groupB.addEventListener("click",async () => {
  if(!await confirmPopUp(`Are You Sure Titikman?`, "No", "Yes")) return
    currentGroup = "B"
    manifestGroup(false)
    await sleep(300)
    manifestQuestionaire()
    questionaireGenerator()
})

fact.addEventListener("click",async () => {
    if(!await confirmPopUp(`Is "Fact" Your final Answer?`, "No", "Yes")) return
    chosenValue = true
    manifestQuestionaire(false)

    if (chosenValue == questionValue) {
        answerQueue("Correct!", true, true)
        await sleep(1000)
        answerQueue("", false)

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

bluff.addEventListener("click",async () => {
  if(!await confirmPopUp(`Is "Bluff" Your final Answer?`, "No", "Yes")) return
    chosenValue = false
    manifestQuestionaire(false)
    
    if (chosenValue == questionValue) {
        answerQueue("Correct!", true, true)
        await sleep(1000)
        answerQueue("", false)

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

take.addEventListener("click", () => {
    if (isDrawable == false) return
    isDrawable = false

    const groupScore = choice(mystery_collection) 
    score.textContent = groupScore
})

give.addEventListener("click", () => {
    if (isDrawable == false) return
    isDrawable = false

    const groupScore = choice(mystery_collection)
    score.textContent = groupScore

})


function manifestGroup(boolean) {
    if(boolean || boolean === undefined) group_wrapper.style.display = "flex"
    else group_wrapper.style.display = "none"
}
function manifestQuestionaire(boolean) {
    if(boolean || boolean === undefined) questionaire_wrapper.style.display = "flex"
    else questionaire_wrapper.style.display = "none"
}
function manifestMystery(boolean) {
    if(boolean || boolean === undefined) mysterious_wrapper.style.display = "flex"
    else mysterious_wrapper.style.display = "none"
}

function questionaireGenerator() {
    const currentQuestion = choice(questionaire_collection)
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
        answer_queue.textContent = "( Text Not Loaded )"
        answer_queue.style.display = "none"
    }

    if (color === true) {
        answer_queue.style.backgroundColor = "skyblue"
    }
    else if(color === false) {
        answer_queue.style.backgroundColor = "rgb(255, 45, 45)"
    }
    else answer_queue.style.backgroundColor = "inherit"
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