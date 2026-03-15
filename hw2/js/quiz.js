document.getElementById("submitQuizBtn").addEventListener("click", gradeQuiz);
document.getElementById("resetQuizBtn").addEventListener("click", initializeGame);

// Global variables for quiz state:
let score = 0;
let bestScore = localStorage.getItem("bestScore") ? parseFloat(localStorage.getItem("bestScore")) : 0;
let attempts = localStorage.getItem("quizAttempts") ? parseInt(localStorage.getItem("quizAttempts")) : 0;

// Quiz questions data structure:
const quizQuestions = [
    { question: "Which U.S. state has the largest population?", choices: ["California", "Texas", "Florida", "New York"], correctAnswers: ["California"], type: "radio" },
    // { question: "Which U.S. state contains Yellowstone National Park?", choices: ["Colorado", "Wyoming", "Utah", "Montana"], correctAnswers: ["Wyoming"], type: "radio" },
    // { question: "Which city is the capital of Illinois?", choices: ["Chicago", "Peoria", "Rockford", "Springfield"], correctAnswers: ["Springfield"], type: "radio" },
    // { question: "Which desert covers much of southern Nevada and eastern California?", choices: ["Sonoran Desert", "Chihuahuan Desert", "Mojave Desert", "Great Basin Desert"], correctAnswers: ["Mojave Desert"], type: "radio" },
    // { question: "Which U.S. state is home to the Grand Canyon?", choices: ["Utah", "Arizona", "Nevada", "Colorado"], correctAnswers: ["Arizona"], type: "radio" },
    // { question: "Lake Tahoe lies on the border between California and Nevada.", choices: ["True", "False"], correctAnswers: ["True"], type: "true-false" },
    // { question: "Which of the following states border the Gulf of Mexico?", choices: ["Texas", "Louisiana", "Mississippi", "Arkansas", "Florida"], correctAnswers: ["Texas", "Louisiana", "Mississippi", "Florida"], type: "checkbox" },
    // { question: "What is the longest river in the United States?", correctAnswers: ["missouri"], type: "text" },
    // { question: "How many time zones are there in the United States (including Alaska and Hawaii)?", correctAnswers: [6], type: "number" },
    // { question: "Which U.S. state is known as the “Empire State”?", choices: ["California", "Pennsylvania", "New York", "Virginia"], correctAnswers: ["New York"], type: "dropdown" }
]





function populateQuiz() {
    const quizSection = document.querySelector("#quizSection");
    quizSection.innerHTML = "";
    quizQuestions.forEach((q, index) => {
        // Variables for question numbering and element IDs
        const questionNum = index + 1;
        const nameAttr = `q${questionNum}`;
        // Create card for each question
        const divCard = document.createElement("div");
        divCard.className = "card mb-3";
        // Create card header with question text
        const divQuestionHeader = document.createElement("div");
        divQuestionHeader.className = "card-header bg-light d-flex justify-content-between";
        divQuestionHeader.id = `q${questionNum}Header`;
        divQuestionHeader.innerHTML = `
            <h5 class="mb-2">${questionNum}. ${q.question}</h5>
            <div class="d-flex align-items-center gap-2">
                <div id="q${questionNum}Feedback" class="px-2 py-1 rounded small d-inline-block"></div>
                <div id="markImg${questionNum}"></div>
            </div>
        `;
        // Create card body for answer choices
        const divCardBody = document.createElement("div");
        divCardBody.className = "card-body text-start";

        if (q.type === "radio") {
            const shuffledChoices = shuffle([...q.choices]);
            shuffledChoices.forEach(choice => {
                const choiceId = `${nameAttr + "-" + choice.toLowerCase().replace(/\s+/g, "-")}`;
                const divChoice = document.createElement("div");
                divChoice.className = "form-check border-top pt-2 pb-2 text-start";
                divChoice.innerHTML = `
                    <input class="form-check-input" type="radio" name="${nameAttr}" id="${choiceId}" value="${choice}">
                    <label class="form-check-label" for="${choiceId}"> ${choice} </label>
                    `;
                divCardBody.appendChild(divChoice);
            });
        }
        else if (q.type === "true-false") {
            q.choices.forEach(choice => {
                const choiceId = `${nameAttr + "-" + choice.toLowerCase().replace(/\s+/g, "-")}`;
                const divChoice = document.createElement("div");
                divChoice.className = "form-check border-top pt-2 pb-2 text-start";
                divChoice.innerHTML = `
                    <input class="form-check-input" type="radio" name="${nameAttr}" id="${choiceId}" value="${choice}">
                    <label class="form-check-label" for="${choiceId}"> ${choice} </label>
                    `;
                divCardBody.appendChild(divChoice);
            });
        }
        else if (q.type === "checkbox") {
            q.choices.forEach(choice => {
                const choiceId = `${nameAttr + "-" + choice.toLowerCase().replace(/\s+/g, "-")}`;
                const divChoice = document.createElement("div");
                divChoice.className = "form-check border-top pt-2 pb-2 text-start";
                divChoice.innerHTML = `
                    <input class="form-check-input" type="checkbox" name="${nameAttr}" id="${choiceId}" value="${choice}">
                    <label class="form-check-label" for="${choiceId}"> ${choice} </label>
                    `;
                divCardBody.appendChild(divChoice);
            });
        }
        else if (q.type === "text") {
            const choiceId = `${nameAttr}-input`;
            const divChoice = document.createElement("div");
            divChoice.className = "pt-2";
            divChoice.innerHTML = `
                <input type="text" name="${nameAttr}" id="${choiceId}" class="form-control">
                `;
            divCardBody.appendChild(divChoice);

        }
        else if (q.type === "number") {
            const choiceId = `${nameAttr}-input`;
            const divChoice = document.createElement("div");
            divChoice.className = "pt-2";
            divChoice.innerHTML = `
                <input type="number" name="${nameAttr}" class="form-control" step="1" id="${choiceId}">
                `;
            divCardBody.appendChild(divChoice);
        }
        else if (q.type === "dropdown") {
            const divChoice = document.createElement("div");
            divChoice.className = "pt-2";
            const select = document.createElement("select");
            select.className = "form-select";
            select.name = nameAttr;
            select.id = `q${questionNum}`;
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Select an answer";
            select.appendChild(option);
            q.choices.forEach(choice => {
                const option = document.createElement("option");
                option.value = choice;
                option.textContent = choice;
                select.appendChild(option);
            });
            divChoice.appendChild(select);
            divCardBody.appendChild(divChoice);
        }
        divCard.appendChild(divQuestionHeader);
        divCard.appendChild(divCardBody);
        quizSection.appendChild(divCard);
    });
}

initializeGame();

function initializeGame() {
    // Reset quiz state
    score = 0;
    populateQuiz();
    // Clear validation feedback
    document.querySelector("#validationFeedback").textContent = "";
    // Hide score and congratulatory message
    document.querySelector("#totalScore").textContent = "";
    document.querySelector("#congratulatoryMessage").textContent = "";
    // Hide reset button and show submit button
    document.getElementById("resetQuizBtn").style.display = "none";
    document.getElementById("submitQuizBtn").style.display = "inline-block";
    // Enable all inputs
    document.querySelectorAll("#quizSection input, #quizSection select")
        .forEach(el => el.disabled = false);
    // Hide all feedback and reset question headers
    quizQuestions.forEach((q, index) => {
        const questionNum = index + 1;
        document.querySelector(`#q${questionNum}Feedback`).textContent = "";
        document.querySelector(`#q${questionNum}Header`).classList.remove("right-answer", "wrong-answer");
        document.querySelector(`#markImg${questionNum}`).innerHTML = "";
        document.querySelector("#validationFeedback").style.display = "none";
    });
    // Hide summary section
    document.querySelector("#quizSummary").style.display = "none";
    document.querySelector("#totalScore").classList.remove("high-score", "low-score");
}

function gradeQuiz() {
    console.log("Grading quiz…");
    score = 0; // reset score for each attempt

    document.querySelector("#validationFeedback").textContent = "";
    if (!isFormValid()) {
        document.querySelector("#validationFeedback").style.display = "block";
        document.querySelector("#validationFeedback").textContent = "Please answer all questions before submitting.";
        console.log("Form is not valid. Please answer all questions before submitting.");
        return;
    }
    else {
        document.querySelector("#validationFeedback").style.display = "none";
    }

    quizQuestions.forEach((q, index) => {
        const questionNum = index + 1;
        const nameAttr = `q${questionNum}`;

        if (q.type === "radio" || q.type === "true-false") {
            let answer = document.querySelector(`input[name="${nameAttr}"]:checked`).value;
            if (answer != q.correctAnswers[0]) {
                console.log(`Question ${questionNum} answer is wrong.`);
                wrongAnswerFeedback(questionNum);
            }
            else {
                rightAnswerFeedback(questionNum);
            }
        }
        else if (q.type === "checkbox") {

            let selectedOptions = Array
                .from(document.querySelectorAll(`input[name="${nameAttr}"]:checked`))
                .map(input => input.value);

            let correctAnswers = q.correctAnswers;

            if (
                selectedOptions.length !== correctAnswers.length ||
                !selectedOptions.every(ans => correctAnswers.includes(ans))
            ) {
                console.log(`Question ${questionNum} answer is wrong.`);
                wrongAnswerFeedback(questionNum);
            }
            else {
                rightAnswerFeedback(questionNum);
            }
        }
        else if (q.type === "text" || q.type === "number") {
            const input = document.querySelector(`input[name="${nameAttr}"]`);
            if (input.value.trim().toLowerCase() != q.correctAnswers[0]) {
                console.log(`Question ${questionNum} answer is wrong.`);
                wrongAnswerFeedback(questionNum);
            }
            else {
                rightAnswerFeedback(questionNum);
            }
        }
        else if (q.type === "dropdown") {
            let answer = document.querySelector(`#q${questionNum}`).value;
            if (answer != q.correctAnswers[0]) {
                console.log(`Question ${questionNum} answer is wrong.`);
                wrongAnswerFeedback(questionNum);
            }
            else {
                rightAnswerFeedback(questionNum);
            }
        }
    });

    // Hide reset button and show submit button
    document.getElementById("submitQuizBtn").style.display = "none";
    document.getElementById("resetQuizBtn").style.display = "inline-block";

    // Disable all inputs after grading
    document.querySelectorAll("#quizSection input, #quizSection select")
        .forEach(el => el.disabled = true);
//show summary section
    document.querySelector("#quizSummary").style.display = "block";

    document.querySelector("#totalScore").textContent = `Total Score: ${score} / 100`;
    document.querySelector("#totalScore").classList.add(score > 80 ? "high-score" : "low-score");
    document.querySelector("#congratulatoryMessage").textContent = score > 80 ? "Excellent work! You scored over 80 points!" : "";
    document.querySelector("#attemptsInfo").textContent = `Attempts: ${++attempts}`;
    localStorage.setItem("quizAttempts", attempts);
    bestScore = score > bestScore ? score : bestScore;
    document.querySelector("#bestScore").textContent = `Best Score: ${bestScore}`;
    localStorage.setItem("bestScore", bestScore);
}

function isFormValid() {
    for (let index = 0; index < quizQuestions.length; index++) {
        const q = quizQuestions[index];
        const nameAttr = `q${index + 1}`;

        if (q.type === "radio" || q.type === "true-false") {
            if (!document.querySelector(`input[name="${nameAttr}"]:checked`)) {
                console.log(`Question ${index + 1} is not answered.`);
                return false;
            }
        }
        else if (q.type === "checkbox") {
            if (!document.querySelectorAll(`input[name="${nameAttr}"]:checked`).length) {
                console.log(`Question ${index + 1} is not answered.`);
                return false;
            }
        }
        else if (q.type === "text" || q.type === "number") {
            const input = document.querySelector(`input[name="${nameAttr}"]`);
            if (!input.value.trim()) {
                console.log(`Question ${index + 1} is not answered.`);
                return false;
            }
        }
        else if (q.type === "dropdown") {
            if (!document.querySelector(`#q${index + 1}`).value) {
                console.log(`Question ${index + 1} is not answered.`);
                return false;
            }
        }
    }
    return true;
}

function rightAnswerFeedback(questionNum) {
    document.querySelector(`#q${questionNum}Feedback`).textContent = "Correct!";
    document.querySelector(`#q${questionNum}Feedback`).className = "text-white";
    document.querySelector(`#q${questionNum}Header`).classList.remove("wrong-answer");
    document.querySelector(`#q${questionNum}Header`).classList.add("right-answer");
    document.querySelector(`#markImg${questionNum}`).innerHTML = "<img src='img/checkmark.png' alt='Correct answer' width='20'>";
    let step = 100 / quizQuestions.length
    score += step;
    score = Math.round(score * 10) / 10; // round to 1 decimal place
    console.log(`Question ${questionNum} is correct. Current score: ${score}`);
}

function wrongAnswerFeedback(questionNum) {
    document.querySelector(`#q${questionNum}Feedback`).innerHTML = "Incorrect!";
    document.querySelector(`#q${questionNum}Feedback`).className = "text-white";
    document.querySelector(`#q${questionNum}Header`).classList.remove("right-answer");
    document.querySelector(`#q${questionNum}Header`).classList.add("wrong-answer");
    document.querySelector(`#markImg${questionNum}`).innerHTML = "<img src='img/x-mark.png' alt='Incorrect answer' width='20'>";
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        // swap elements
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


//displayQ4Choices();

// function displayQ4Choices() {
//     q4Choices = ["Rhode Island", "Delaware", "Connecticut", "New Jersey"];
//     //q4Choices = _.shuffle(q4Choices);
//     q4Choices = shuffle(q4Choices);
//     const q4Select = document.querySelector("#q4Choices");

//     q4Choices.forEach(choice => {
//         const div = document.createElement("div");
//         div.className = "form-check";
//         let choiceId = choice.toLowerCase().replace(" ", "-");
//         div.innerHTML = `
//                 <input type="radio" name="q4" id="${choiceId}" value="${choice}">
//                 <label for="${choiceId}"> ${choice} </label>
//         `;
//         q4Select.appendChild(div);
//     });
// }


// function gradeQuiz_Original() {
//     console.log("Grading quiz…");
//     score = 0; // reset score for each attempt

//     document.querySelector("#validationFeedback").textContent = "";
//     if (!isFormValid()) {
//         return;
//     }

//     let q1Response = document.querySelector("#q1").value.toLowerCase();
//     let q2Response = document.querySelector("#q2").value.toLowerCase();
//     let q4Response = document.querySelector("input[name='q4']:checked").value.toLowerCase();
//     console.log(q1Response);
//     console.log(q2Response);
//     console.log(q4Response);

//     if (q1Response === "sacramento") {
//         rightAnswerFeedback(1);
//     } else {
//         wrongAnswerFeedback(1);
//     }
//     if (q2Response === "missouri") {
//         rightAnswerFeedback(2);
//     } else {
//         wrongAnswerFeedback(2);
//     }
//     if (document.querySelector("#washington").checked &&
//         document.querySelector("#jefferson").checked &&
//         document.querySelector("#roosevelt").checked &&
//         document.querySelector("#lincoln").checked &&
//         !(document.querySelector("#franklin").checked ||
//             document.querySelector("#jackson").checked)
//     ) {
//         rightAnswerFeedback(3);
//     } else {
//         wrongAnswerFeedback(3);
//     }
//     if (q4Response === "rhode island") {
//         rightAnswerFeedback(4);
//     } else {
//         wrongAnswerFeedback(4);
//     }


//     document.querySelector("#totalScore").textContent = `Total Score: ${score}`;
//     document.querySelector("#totalScore").className = score > 80 ? "high-score" : "low-score";
//     document.querySelector("#congratulatoryMessage").textContent = score > 80 ? "Excellent work! You scored over 80 points!" : "";
//     document.querySelector("#attemptsInfo").textContent = `Attempts: ${++attempts}`;
//     localStorage.setItem("quizAttempts", attempts);
// }

// function isFormValid_Original() {
//     let isValid = true;
//     if (document.querySelector("#q1").value === "") {
//         isValid = false;
//         document.querySelector("#validationFeedback").textContent = "Please answer all questions before submitting.";
//     }
//     return isValid;
// }