document.addEventListener("DOMContentLoaded", init);

let currentSuggestedPassword = "";
let isUsernameValid = false;

async function init() {
    document.querySelector("#zip").addEventListener("change", displayCity);
    document.querySelector("#state").addEventListener("change", handleStateChange);
    document.querySelector("#username").addEventListener("change", checkUsername);
    document.querySelector("#county").addEventListener("change", resetZipCode);
    document.querySelector("#password").addEventListener("click", renderPasswordControls);
    document.querySelector("#signupForm").addEventListener("submit", function (event) {
        validateForm(event);
    });

    await displayStates();
    currentSuggestedPassword = await generatePassword(12);
    // await delay(500);
    //renderPasswordControls();

    
}

async function refreshPassword() {
    const icon = document.querySelector("#refreshPwdBtn svg");
    icon.classList.add("spin");

    console.log("Generating new password...");

    currentSuggestedPassword = await generatePassword(12);
    // currentSuggestedPassword = "NewPassword123!";
    updatePasswordButtonText();

    await delay(700);
    icon.classList.remove("spin");
}

function renderPasswordControls() {
    document.querySelector("#suggestedPwd").innerHTML = `
        <div class="d-flex gap-2">
        <button type="button" id="refreshPwdBtn" class="refresh-btn btn btn-outline-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 8a5 5 0 1 1-1.5-3.5" />
            <polyline points="13 3 13 6 10 6" />
        </svg>
        </button>

            <button id="useSuggestPwdBtn" type="button" class="btn btn-outline-primary w-100">
                Use Suggested Password: ${currentSuggestedPassword}
            </button>

        </div>
    `;
    document.querySelector("#useSuggestPwdBtn").addEventListener("click", useGeneratedPassword);
    document.querySelector("#refreshPwdBtn").addEventListener("click", refreshPassword);
}

function updatePasswordButtonText() {
    document.querySelector("#useSuggestPwdBtn").textContent =
        `Use Suggested Password: ${currentSuggestedPassword}`;
}

function useGeneratedPassword() {
    document.querySelector("#passwordError").innerHTML = "";
    document.querySelector("#password").value = currentSuggestedPassword;
    document.querySelector("#confirmPassword").value = currentSuggestedPassword;
}

async function displayCity() {
    //alert(document.querySelector("#zip").value);
    let zipCode = document.querySelector("#zip").value;
    console.log(zipCode);
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    if (data === false) {
        console.log("Invalid zip code.");
        document.querySelector("#zipCodeError").innerHTML = "Zip code not found";
        document.querySelector("#zipCodeError").style.color = "red";
        document.querySelector("#city").innerHTML = "";
        document.querySelector("#latitude").innerHTML =  "";
        document.querySelector("#longitude").innerHTML =  "";
        document.querySelector("#state").value = "";
        document.querySelector("#county").value = "selectCounty";
        document.querySelector("#county").disabled = true;
    } else {
        document.querySelector("#zipCodeError").innerHTML = "";
        document.querySelector("#city").innerHTML = `${data.city}`;
        document.querySelector("#latitude").innerHTML = `${data.latitude}`;
        document.querySelector("#longitude").innerHTML = `${data.longitude}`;
        document.querySelector("#state").value = `${data.state}`;
        displayCounties(data.county);
    }
}

async function displayCounties(county = "selectCounty") {
    let countyList = document.querySelector("#county");
    countyList.innerHTML = "<option value='selectCounty'>Select County</option>";
    countyList.disabled = true;
    let state = document.querySelector("#state").value;
    console.log(state);
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    for (let i of data) {
        countyList.innerHTML += `<option value="${i.county}">${i.county}</option>`;
    }
    if (county !== "selectCounty") {
        console.log(county);
        countyList.value = county;
    }
    else {
        countyList.value = "selectCounty";
    }
    countyList.disabled = false;
}

async function displayStates() {
    let statesList = document.querySelector("#state");
    statesList.innerHTML = "<option value=''>Select State</option>";
    statesList.disabled = true;
    let state = document.querySelector("#state").value;
    console.log(state);
    let url = `https://csumb.space/api/allStatesAPI.php?`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    for (let i of data) {
        statesList.innerHTML += `<option value="${i.usps}">${i.state}</option>`;
    }
    statesList.disabled = false;
}

async function checkUsername() {
    let username = document.querySelector("#username").value;
    console.log(username);
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let usernameError = document.querySelector("#usernameError");
    if (data.available) {
        usernameError.innerHTML = "Username is available!";
        usernameError.style.color = "green";
        isUsernameValid = true;
    } else {
        usernameError.innerHTML = "Username is not available.";
        usernameError.style.color = "red";
        isUsernameValid = false;
    }

}

async function generatePassword(passwordLength = 8) {
    let url = `https://csumb.space/api/suggestedPassword.php?length=${passwordLength}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    return data.password;
}

function validateForm(event) {
    let isValid = true;
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let confirmPassword = document.querySelector("#confirmPassword").value;
    if (username.length == 0) {
        isValid = false;
        document.querySelector("#usernameError").innerHTML = "Username cannot be empty.";
        document.querySelector("#usernameError").style.color = "red";
    }
    else if (!isUsernameValid) {
        isValid = false;
        document.querySelector("#usernameError").innerHTML = "Please choose a different username.";
        document.querySelector("#usernameError").style.color = "red";
    }
    if (password.length < 6) {
        isValid = false;
        document.querySelector("#passwordError").innerHTML = "Password must be at least 6 characters long.";
        document.querySelector("#passwordError").style.color = "red";
    }
    if (password !== confirmPassword) {
        isValid = false;
        document.querySelector("#passwordError").innerHTML = "Passwords do not match.";
        document.querySelector("#passwordError").style.color = "red";
    }
    if (!isValid) {
        event.preventDefault();
    }
}

function resetZipCode() {
    document.querySelector("#zip").value = "";
    document.querySelector("#city").innerHTML = "";
    document.querySelector("#latitude").innerHTML = "";
    document.querySelector("#longitude").innerHTML = "";
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleStateChange() {
    resetZipCode();
    displayCounties();
}