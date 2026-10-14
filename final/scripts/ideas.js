import { loadIdeas } from "./data.js";
const allIdeas = document.querySelector("#allIdeas");
const ideaCount = document.querySelector("#ideaCount");
const categoryFilter = document.querySelector("#categoryFilter");
const currentYear = document.querySelector("#currentYear");
const ideaDialog = document.querySelector("#ideaDialog");
const closeDialog = document.querySelector("#closeDialog");

let ideas = [];

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

async function displayLoadedIdeas() {
    try {
        ideas = await loadIdeas();

        populateCategories();
        displayIdeas(ideas);
    } catch (error) {
        console.error("Error loading ideas:", error);

        allIdeas.innerHTML = `
            <p>We could not load the ideas. Please try again later.</p>
        `;

        ideaCount.textContent = "Ideas unavailable";
    }
}

function populateCategories() {
    const categories = [...new Set(ideas.map((idea) => idea.category))];

    categories.sort().forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.append(option);
    });
}

function displayIdeas(ideaList) {
    ideaCount.textContent = `${ideaList.length} ideas found`;

    if (ideaList.length === 0) {
        allIdeas.innerHTML = "<p>No ideas match this category.</p>";
        return;
    }

    allIdeas.innerHTML = ideaList.map((idea) => `
        <article class="idea-card">
            <p class="idea-category">${idea.category}</p>
            <h3>${idea.title}</h3>
            <p>${idea.description}</p>
            <p><strong>Stage:</strong> ${idea.stage}</p>
            <p><strong>Looking for:</strong> ${idea.need}</p>
            <p><strong>Location:</strong> ${idea.location}</p>
        </article>
    `).join("");
}

categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;

    const filteredIdeas = selectedCategory === "all"
        ? ideas
        : ideas.filter((idea) => idea.category === selectedCategory);

    displayIdeas(filteredIdeas);
});
allIdeas.addEventListener("click", (event) => {
    const card = event.target.closest(".idea-card");

    if (!card) {
        return;
    }

    const title = card.querySelector("h3")?.textContent;
    const idea = ideas.find((item) => item.title === title);

    if (!idea) {
        return;
    }

    document.querySelector("#dialogCategory").textContent = idea.category;
    document.querySelector("#dialogTitle").textContent = idea.title;
    document.querySelector("#dialogDescription").textContent = idea.description;
    document.querySelector("#dialogStage").textContent = idea.stage;
    document.querySelector("#dialogLocation").textContent = idea.location;
    document.querySelector("#dialogNeed").textContent = idea.need;

    localStorage.setItem("selectedIdea", idea.id);

document.querySelector("#dialogConnectLink").href =
    `connect.html?id=${idea.id}`;

    ideaDialog.showModal();
});

closeDialog.addEventListener("click", () => {
    ideaDialog.close();
});

ideaDialog.addEventListener("click", (event) => {
    if (event.target === ideaDialog) {
        ideaDialog.close();
    }
});

displayLoadedIdeas();