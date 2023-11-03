function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}/${month}-${day}`;
}

const priceKlasse = 'DK2';

function formatTime(dateTime) {
    return new Date(dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

fetch(`https://www.elprisenligenu.dk/api/v1/prices/${getCurrentDate()}_${priceKlasse}.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        // Call the function to display the data in the HTML
        displayData(data);
    })
    .catch(error => {
        console.error("Failed to retrieve data from the API:", error);
    });

function extractPriceForNext24Hours(data) {
    const currentTime = new Date();
    const endTime = new Date(currentTime);
    endTime.setHours(endTime.getHours() + 24);

    return data.filter(interval => {
        const intervalStart = new Date(interval.time_start);
        return intervalStart >= currentTime && intervalStart <= endTime;
    });
}

function displayData(data) {
    const pricesForNext24Hours = extractPriceForNext24Hours(data);

    const lowestPrice = Math.min(...pricesForNext24Hours.map(interval => interval.DKK_per_kWh));
    const highestPrice = Math.max(...pricesForNext24Hours.map(interval => interval.DKK_per_kWh));

    const oversigtDataDiv = document.getElementById("oversigtData");

    const lowestPriceTextDiv = document.getElementById('lowestText')
    const highestPriceTextDiv = document.getElementById('highestText')

    const lowestPriceText = document.createElement("p");
    lowestPriceText.textContent = `${lowestPrice} KR`;

    const highestPriceText = document.createElement("p");
    highestPriceText.textContent = `${highestPrice} KR`;

    lowestPriceTextDiv.appendChild(lowestPriceText);
    highestPriceTextDiv.appendChild(highestPriceText);

    const oversigtDiv = document.createElement("div");
    oversigtDiv.id = "oversigt";

    pricesForNext24Hours.forEach((interval, index) => {
        const oversigtTextDiv = document.createElement("div");
        oversigtTextDiv.classList.add("oversigtText");
        oversigtDiv.appendChild(oversigtTextDiv);

        const startTime = new Date(interval.time_start);
        const startTimeStr = formatTime(startTime);

        const timeIntervalText = document.createElement("p");
        timeIntervalText.textContent = `kl. ${startTimeStr}`;
        const oversigtPris = document.createElement("p");
        oversigtPris.textContent = `${interval.DKK_per_kWh} kr`;

        oversigtTextDiv.appendChild(timeIntervalText);
        oversigtTextDiv.appendChild(oversigtPris);
    });

    oversigtDataDiv.appendChild(oversigtDiv);
}