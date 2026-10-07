import { discoverItems } from "../data/discover.mjs";

const discoverGrid = document.querySelector("#discoverGrid");
const visitMessage = document.querySelector("#visitMessage");

function displayDiscoverItems(items) {
    discoverGrid.innerHTML = items.map((item, index) => `
        <article class="discover-card card-${index + 1}">
            <h2>${item.name}</h2>

            <figure>
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="300"
                    height="200"
                    loading="lazy"
                >
            </figure>

            <address>${item.address}</address>

            <p>${item.description}</p>

            <button type="button">Learn More</button>
        </article>
    `).join("");
}

function displayVisitMessage() {
    const currentVisit = Date.now();
    const lastVisit = localStorage.getItem("lastVisit");

    if (!lastVisit) {
        visitMessage.textContent =
            "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = currentVisit - Number(lastVisit);
        const daysSinceVisit = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        if (daysSinceVisit < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else if (daysSinceVisit === 1) {
            visitMessage.textContent = "You last visited 1 day ago.";
        } else {
            visitMessage.textContent =
                `You last visited ${daysSinceVisit} days ago.`;
        }
    }

    localStorage.setItem("lastVisit", currentVisit);
}

displayDiscoverItems(discoverItems);
displayVisitMessage();