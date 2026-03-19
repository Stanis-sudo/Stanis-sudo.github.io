const input = document.querySelector("#searchInput");
const searchForm = document.querySelector("#searchForm");
const results = document.querySelector("#results");
const validationMessage = document.getElementById("validationMessage");
const pagination = document.querySelector("#pagination");

let currentPage = 1;
let pages = 0;
let currentName = "";

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    currentName = input.value.trim();
    console.log("Search submitted with name:", currentName);
    console.log("Typeof currentName:", typeof currentName);
    if (!validateInput()) {
        return;
    }

    validationMessage.textContent = "";
    input.classList.remove("is-invalid");

    currentPage = 1;
    loadCharacters(currentName, currentPage);
});

pagination.addEventListener("click", (e) => {
    const pageItem = e.target.closest(".page-item");
    if (!pageItem || pageItem.classList.contains("disabled")) {
        return;
    }
    const selectedPage = Number(pageItem.dataset.page);
    if (!selectedPage || selectedPage === currentPage) {
        return;
    }
    currentPage = selectedPage;
    loadCharacters(currentName, currentPage);
});

// Form Validation
function validateInput() {
    if (currentName === "") {
        showMessageCard("Input cannot be empty. Please type a character name or type 'All Characters' to display all characters.", "emptyInput");
        input.classList.add("is-invalid");
        pagination.innerHTML = "";
        return false;
    }
    return true;
}
console.log("Script loaded");


async function loadCharacters(name, page = 1) {

    let url = "";
    if (name.toLowerCase() === "all characters") {
        url = `https://rickandmortyapi.com/api/character/`;
    } else {
        url = `https://rickandmortyapi.com/api/character/?name=${name}&page=${page}`;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (!response.ok || data.error) {
            showMessageCard(data.error || "Error fetching data. Please try again later.", "nothingFound");
            return;
        }

        pages = data.info.pages;
        results.innerHTML = "";
        data.results.forEach(character => {
            results.innerHTML += `
                <div class="col-md-4 col-lg-3">
                    <div class="card h-100">
                        <img src="${character.image}" class="card-img-top" alt="Character">
                        <div class="card-body">
                        <h5 class="card-title dynapuff h3">${character.name}</h5>
                        <p class="card-text">
                            Species: <span class="sour-gummy">${character.species}</span> <br>
                            Status: <span class="sour-gummy">${character.status}</span> <br>
                            Gender: <span class="sour-gummy">${character.gender}</span> <br>
                            Origin: <span class="sour-gummy">${character.origin.name}</span> <br>
                            Location: <span class="sour-gummy">${character.location.name}</span> <br>
                        </p>
                        </div>
                    </div>
                </div>
                `;
        });
        results.scrollIntoView({ behavior: "smooth" });
        renderPagination();

    } catch (error) {
        console.error("Error fetching data:", error);
        showMessageCard("Error fetching data. Please try again later.", "nothingFound");
    }
}

function showMessageCard(message, type = "") {
    let imgHtml = "";
    if (type === "nothingFound") {
        imgHtml = "<img src='img/resultsnotfound.png' class='mb-3' alt='No results found'>";
    }
    else if (type === "emptyInput") {
        imgHtml = "<img src='img/hope.png' class='mb-3' alt='Empty input'>";
    }
    results.innerHTML = `
        <div class="col-12 d-flex justify-content-center">
            <div class="card text-center shadow-sm" style="max-width: 400px; width: 100%;">
                <div class="card-body">
                    <h5 class="card-title">Notice</h5>
                    <p class="card-text mb-0 dynapuff notice-color">${message}</p>
                    ${imgHtml}
                </div>
            </div>
        </div>
    `;
    //results.innerHTML = nothingHere + messageHtml;
    pagination.innerHTML = "";
}

function createPageItem(page, isActive = false) {
    return `
        <li class="page-item ${isActive ? "active" : ""}" data-page="${page}">
            <a class="page-link cursor-pointer" ${isActive ? 'aria-current="page"' : ""}>${page}</a>
        </li>
    `;
}

function createDisabledDots() {
    return `
        <li class="page-item disabled">
            <a class="page-link">...</a>
        </li>
    `;
}

function createPrevItem() {
    return `
        <li class="page-item" data-page="${currentPage - 1}">
            <a class="page-link cursor-pointer">Previous</a>
        </li>
    `;
}

function createNextItem() {
    return `
        <li class="page-item" data-page="${currentPage + 1}">
            <a class="page-link cursor-pointer">Next</a>
        </li>
    `;
}

function renderPagination() {
    let html = "";

    // If only 1 page, show nothing
    if (pages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    // Previous button
    if (currentPage > 1) {
        html += createPrevItem();
    }

    // 2 or 3 pages -> show all page numbers
    if (pages <= 3) {
        for (let i = 1; i <= pages; i++) {
            html += createPageItem(i, i === currentPage);
        }
    } else {
        // More than 3 pages

        // Always show first page
        html += createPageItem(1, currentPage === 1);

        if (currentPage === 1) {
            // 1 ... last
            html += createDisabledDots();
            html += createPageItem(pages, false);
        } else if (currentPage === 2) {
            // 1 2 ... last
            html += createPageItem(2, true);
            html += createDisabledDots();
            html += createPageItem(pages, false);
        } else if (currentPage === pages - 1) {
            // 1 ... pages-1 pages
            html += createDisabledDots();
            html += createPageItem(currentPage, true);
            html += createPageItem(pages, false);
        } else if (currentPage === pages) {
            // 1 ... last
            html += createDisabledDots();
            html += createPageItem(pages, true);
        } else {
            // 1 ... current ... last
            html += createDisabledDots();
            html += createPageItem(currentPage, true);
            html += createDisabledDots();
            html += createPageItem(pages, false);
        }
    }

    // Next button
    if (currentPage < pages) {
        html += createNextItem();
    }

    pagination.innerHTML = html;
}