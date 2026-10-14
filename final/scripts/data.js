
export async function loadIdeas() {
    try {
        const response = await fetch("data/ideas.json");

        if (!response.ok) {
            throw new Error(`Unable to load ideas: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error loading ideas:", error);
        throw error;
    }
}
