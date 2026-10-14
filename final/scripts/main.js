
import { loadIdeas } from "./data.js";

const featuredIdeas = document.querySelector("#featuredIdeas");
const currentYear = document.querySelector("#currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

async function displayFeaturedIdeas() {
    try {
        const ideas = await loadIdeas();
        displayIdeaCards(ideas);
    } catch (error) {
        console.error("Error loading ideas:", error);

        if (featuredIdeas) {
            featuredIdeas.innerHTML = `
                <p>
                    We could not load the ideas right now.
                    Please try again later.
                </p>
            `;
        }
    }
}

function displayIdeaCards(ideas) {
    if (!featuredIdeas) {
        return;
    }

    const featured = ideas.slice(0, 6);

    featuredIdeas.innerHTML = featured.map((idea) => `
        <article class="idea-card">
            <p class="idea-category">${idea.category}</p>
            <h3>${idea.title}</h3>
            <p>${idea.description}</p>
            <p><strong>Stage:</strong> ${idea.stage}</p>
            <p><strong>Location:</strong> ${idea.location}</p>
            <a href="ideas.html?id=${idea.id}" class="text-link">
                View Idea
            </a>
        </article>
    `).join("");
}

displayFeaturedIdeas();
