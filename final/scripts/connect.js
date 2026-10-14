
import { loadIdeas } from "./data.js";

const selectedIdea = document.querySelector("#selectedIdea");
const connectionForm = document.querySelector("#connectionForm");
const currentYear = document.querySelector("#currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

async function loadIdeaOptions() {
    try {
        const ideas = await loadIdeas();

        ideas.forEach((idea) => {
            const option = document.createElement("option");
            option.value = String(idea.id);
            option.textContent = idea.title;
            selectedIdea.append(option);
        });

        const savedIdea = localStorage.getItem("selectedIdea");

        if (savedIdea) {
            let savedIdeaId = savedIdea;

            try {
                const parsedIdea = JSON.parse(savedIdea);

                if (parsedIdea && parsedIdea.id !== undefined) {
                    savedIdeaId = String(parsedIdea.id);
                }
            } catch {
                // The saved value is already a plain idea ID.
            }

            const matchingSavedIdea = ideas.find(
                (idea) => String(idea.id) === savedIdeaId
            );

            if (matchingSavedIdea) {
                selectedIdea.value = String(matchingSavedIdea.id);
            }
        }

        const params = new URLSearchParams(window.location.search);
        const ideaId = params.get("id");

        if (ideaId && ideas.some((idea) => String(idea.id) === ideaId)) {
            selectedIdea.value = ideaId;
        }
    } catch (error) {
        console.error("Unable to load idea options:", error);

        selectedIdea.innerHTML = `
            <option value="">Ideas could not be loaded</option>
        `;
    }
}

if (connectionForm) {
    connectionForm.addEventListener("submit", () => {
        localStorage.removeItem("selectedIdea");
    });
}

loadIdeaOptions();
