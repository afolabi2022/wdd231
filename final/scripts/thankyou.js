
const currentYear = document.querySelector("#currentYear");
const confirmationMessage = document.querySelector("#confirmationMessage");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const params = new URLSearchParams(window.location.search);
const fullName = params.get("fullName");
const selectedIdea = params.get("selectedIdea");

if (fullName && selectedIdea && confirmationMessage) {
    confirmationMessage.textContent =
        `Thank you, ${fullName}. Your demonstration request has been recorded for the selected idea.`;
}