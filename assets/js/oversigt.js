// Function to get the current date in the format YYYY-MM-DD
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}/${month}-${day}`;
}

// Define the desired price class
const priceClass = 'DK2'; // Replace with the desired price class

// Function to format time to HH:mm
function formatTime(dateTime) {
    return new Date(dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Function to extract price data for the next 24 hours
function extractPriceForNext24Hours(data) {
    const currentTime = new Date();
    const endTime = new Date(currentTime);
    endTime.setHours(endTime.getHours() + 24);

    return data.filter(interval => {
        const intervalStart = new Date(interval.time_start);
        return intervalStart >= currentTime && intervalStart <= endTime;
    });
}

// Make a GET request to the API using the current date
fetch(`https://www.elprisenligenu.dk/api/v1/prices/${getCurrentDate()}_${priceClass}.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Debug: Print the data to the console

        // Extract price data for the next 24 hours
        const pricesForNext24Hours = extractPriceForNext24Hours(data);

        // Find the lowest and highest prices
        const lowestPrice = Math.min(...pricesForNext24Hours.map(interval => interval.DKK_per_kWh));
        const highestPrice = Math.max(...pricesForNext24Hours.map(interval => interval.DKK_per_kWh));

        const priceDataDiv = document.getElementById("priceData");

        const lowestPriceTextDiv = document.getElementById('lowestText')
        const highestPriceTextDiv = document.getElementById('highestText')

        // Create elements for the lowest and highest prices
        const lowestPriceText = document.createElement("p");
        lowestPriceText.textContent = `${lowestPrice} KR`;

        const highestPriceText = document.createElement("p");
        highestPriceText.textContent = `${highestPrice} KR`;

        // Add the lowest and highest prices to the "priceData" div
        lowestPriceTextDiv.appendChild(lowestPriceText);
        highestPriceTextDiv.appendChild(highestPriceText);

        const oversigtDiv = document.createElement("div");
        oversigtDiv.id = "oversigt";

        // Display the price data for the next 24 hours
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

        // Add the "oversigt" div to the "priceData" div
        priceDataDiv.appendChild(oversigtDiv);
    })
    .catch(error => {
        console.error("Failed to retrieve data from the API:", error);
    });