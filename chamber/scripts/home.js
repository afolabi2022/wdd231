const spotlightContainer = document.querySelector("#spotlights");
const currentWeather = document.querySelector("#currentWeather");
const forecastContainer = document.querySelector("#forecastContainer");

const weatherApiKey = "2cf93cf20c702a87b590cc2ec45f2227";

const latitude = 6.3156;
const longitude = -10.8074;


async function getWeather() {

    try {

        const currentUrl =
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`;

        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Unable to retrieve weather data.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {

        console.error("Weather error:", error);

        currentWeather.innerHTML =
            "<p>Weather information is currently unavailable.</p>";

        forecastContainer.innerHTML =
            "<p>Forecast information is currently unavailable.</p>";
    }
}


function displayCurrentWeather(data) {

    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;

    currentWeather.innerHTML = `
        <div class="weather-current">

            <div class="weather-temperature">
                ${temperature}&deg;C
            </div>

            <div>
                <p><strong>Condition:</strong> ${description}</p>

                <p>
                    <strong>Feels like:</strong>
                    ${Math.round(data.main.feels_like)}&deg;C
                </p>

                <p>
                    <strong>Humidity:</strong>
                    ${data.main.humidity}%
                </p>
            </div>

        </div>
    `;
}


function displayForecast(data) {

    const dailyForecasts = [];

    data.list.forEach(item => {

        const date = new Date(item.dt * 1000);

        const hour = date.getHours();

        if (hour >= 11 && hour <= 14) {

            const dateString = date.toDateString();

            if (!dailyForecasts.some(day => day.date === dateString)) {

                dailyForecasts.push({
                    date: dateString,
                    temperature: Math.round(item.main.temp)
                });
            }
        }
    });

    const threeDayForecast = dailyForecasts.slice(0, 3);

    forecastContainer.innerHTML = "";

    threeDayForecast.forEach(day => {

        const article = document.createElement("article");

        article.classList.add("forecast-card");

        article.innerHTML = `
            <h4>${getDayName(day.date)}</h4>
            <p>${day.temperature}&deg;C</p>
        `;

        forecastContainer.appendChild(article);
    });
}


function getDayName(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        weekday: "long"
    });
}


async function getSpotlights() {

    try {

        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load member data.");
        }

        const members = await response.json();

        const eligibleMembers = members.filter(
            member =>
                member.membershipLevel === 2 ||
                member.membershipLevel === 3
        );

        const shuffledMembers = [...eligibleMembers].sort(
            () => Math.random() - 0.5
        );

        const selectedMembers = shuffledMembers.slice(0, 3);

        displaySpotlights(selectedMembers);

    } catch (error) {

        console.error("Spotlight error:", error);

        spotlightContainer.innerHTML =
            "<p>Business spotlights are currently unavailable.</p>";
    }
}


function displaySpotlights(members) {

    spotlightContainer.innerHTML = "";

    members.forEach(member => {

        const card = document.createElement("article");

        card.classList.add("spotlight-card");

        const membership =
            member.membershipLevel === 3
                ? "Gold Member"
                : "Silver Member";

        card.innerHTML = `
            <h3>${member.name}</h3>

            <img
                src="images/${member.image}"
                alt="${member.name} logo"
                loading="lazy"
                width="100"
                height="100">

            <p class="tagline">${member.tagline}</p>

            <p>
                <strong>Phone:</strong>
                ${member.phone}
            </p>

            <p>
                <strong>Address:</strong>
                ${member.address}
            </p>

            <p>
                <strong>Membership:</strong>
                ${membership}
            </p>

            <p>
                <a
                    href="${member.website}"
                    target="_blank"
                    rel="noopener noreferrer">
                    Visit Website
                </a>
            </p>
        `;

        spotlightContainer.appendChild(card);
    });
}


getWeather();
getSpotlights();