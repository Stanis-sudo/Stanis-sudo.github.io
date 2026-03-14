// Event Listeners
document.getElementById('btnGuess').addEventListener('click', checkGuess);
document.getElementById('guessInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});
document.getElementById('btnReset').addEventListener('click', initializeGame);

// Global Variables
let randomNumber = 0;
let attempts = 0;
let guessedNumbers = [];
let gamesWon = 0;
let gamesLost = 0;
const maxAttempts = 7;

initializeGame();

function initializeGame() {
    attempts = 0;
    guessedNumbers = [];
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log(`Random number: ${randomNumber}`);

    // Hide the reset button
    document.getElementById('btnReset').style.display = 'none';
    // Show the guess button
    document.getElementById('btnGuess').style.display = 'inline-block';
    // Clear previous guesses
    let guessItems = document.querySelectorAll('.guess-item');
    guessItems.forEach((item, i) => {
        item.textContent = guessedNumbers[i] || '';
        item.style.backgroundColor = '#f0f0f0';
    });
    // Hide previous guesses Container
    document.getElementById('previousGuessesContainer').style.display = 'none';
    // Hide Score Container
    if (gamesWon > 0 || gamesLost > 0) {
        document.getElementById('scoreContainer').style.display = 'block';
    } else {
        document.getElementById('scoreContainer').style.display = 'none';
    }
    // Clear and hide previous feedback
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').style.display = 'none';
    // Clear and focus the input field
    guessInput = document.getElementById('guessInput');
    guessInput.value = '';
    guessInput.disabled = false;
    guessInput.focus();
}

function checkGuess() {
    let guessInput = document.getElementById('guessInput');
    // Get the user's guess and log it with the random number and attempts
    let guessResult = Number(guessInput.value);
    console.log(`Guess: ${guessResult}, Random Number: ${randomNumber}`);
    // Clear the input field
    guessInput.value = '';
    // Clear the feedback
    let feedbackElement = document.querySelector('#feedback');
    feedbackElement.textContent = '';
    // Check if the guess is valid
    if (isNaN(guessResult) || guessResult < 1 || guessResult > 99) {
        feedbackElement.textContent = 'Please enter a valid number between 1 and 99.';
        feedbackElement.style.color = 'red';
        feedbackElement.style.display = 'block';
        return;
    }
    // Valid guess
    if (guessedNumbers.includes(guessResult)) {
        feedbackElement.textContent = 'You already guessed that number! Try a different one.';
        feedbackElement.style.color = 'orange';
        return;
    } else {
        guessedNumbers.push(guessResult);
        attempts++;
        console.log(`Attempts: ${attempts}`);
    }
    if (guessResult === randomNumber) {
        feedbackElement.innerHTML = `<span class="sour-gummy-result">You won!</span><br> Congratulations! You've guessed the number in ${attempts} attempts!`;
        feedbackElement.style.color = 'green';
        feedbackElement.style.display = 'block';
        gamesWon++;
        document.getElementById('wins').textContent = gamesWon;
        document.getElementById('scoreContainer').style.display = 'block';
        updatePreviousGuessesContainer();
        endGame();
        return;
    }
    updatePreviousGuessesContainer();
    document.getElementById('previousGuessesContainer').style.display = 'block';
    if (attempts >= maxAttempts) {
        feedbackElement.innerHTML = `<span class="sour-gummy-result">Game over!</span><br>Sorry, you lost! <br> The correct number was ${randomNumber}.`;
        feedbackElement.style.color = 'red';
        feedbackElement.style.display = 'block';
        gamesLost++;
        document.getElementById('losses').textContent = gamesLost;
        document.getElementById('scoreContainer').style.display = 'block';
        endGame();
    }
    else if (guessResult < randomNumber) {
        feedbackElement.textContent = 'Too low! Try again.';
        feedbackElement.style.color = 'orange';
        feedbackElement.style.display = 'block';
    } else {
        feedbackElement.textContent = 'Too high! Try again.';
        feedbackElement.style.color = 'red';
        feedbackElement.style.display = 'block';
    }
}

function updatePreviousGuessesContainer() {
    let guessItems = document.querySelectorAll('.guess-item');
    guessItems.forEach((item, index) => {
        if (guessedNumbers[index] !== undefined) {
            item.textContent = guessedNumbers[index];
            if (guessedNumbers[index] === randomNumber) {
                item.style.backgroundColor = '#99ff99';
            } else if (guessedNumbers[index] < randomNumber) {
                item.style.backgroundColor = '#ffffb3';
            } else {
                item.style.backgroundColor = ' #ff9999';
            }
        } else {
            item.textContent = '';
        }
    });
}

function endGame() {
    // Hide the guess button and show the reset button
    guessButton = document.getElementById('btnGuess');
    guessButton.style.display = 'none';
    resetButton = document.getElementById('btnReset');
    resetButton.style.display = 'inline-block';
    // Disable the input field
    document.getElementById('guessInput').disabled = true;
    setTimeout(function () {
        resetButton.focus();;
    }, 1000);

}