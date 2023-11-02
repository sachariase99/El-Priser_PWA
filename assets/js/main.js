// oversigt.js

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

// Make a GET request to the API using the current date
fetch(`https://www.elprisenligenu.dk/api/v1/prices/${getCurrentDate()}_${priceClass}.json`)
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

// Function to display the extracted data in the HTML
function displayData(data) {
    console.log(data); // Debug: Print the data to the console

    // Extract price data for the next 24 hours
    const pricesForNext24Hours = extractPriceForNext24Hours(data);

    // Find the lowest and highest prices
const lowestPrice = Math.min(...pricesForNext24Hours.map(interval => interval.DKK_per_kWh));
const highestPrice = Math.max(...pricesForNext24Hours.map(interval => interval.DKK_per_kWh));

const oversigtDataDiv = document.getElementById('oversigtData');

const lowestPriceTextDiv = document.getElementById('lowestText'); // Select the 'lowest' div
console.log(lowestPriceTextDiv); // Log the selected element

const highestPriceTextDiv = document.getElementById('highestText'); // Select the 'highest' div
console.log(highestPriceTextDiv); // Log the selected element

const lowestPriceWebTextDiv = document.getElementById('lowestTextWeb'); // Select the 'lowest' div
console.log(lowestPriceTextDiv); // Log the selected element

const highestPriceWebTextDiv = document.getElementById('highestTextWeb'); // Select the 'highest' div
console.log(highestPriceTextDiv); // Log the selected element

// Clear existing content in the lowestText and highestText divs
lowestPriceTextDiv.innerHTML = '';
highestPriceTextDiv.innerHTML = '';
lowestPriceWebTextDiv.innerHTML = '';
highestPriceWebTextDiv.innerHTML = '';

// Create elements for the lowest and highest prices
const lowestPriceText = document.createElement('p');
lowestPriceText.textContent = `${lowestPrice} KR`;

const highestPriceText = document.createElement('p');
highestPriceText.textContent = `${highestPrice} KR`;

const lowestPriceWebText = document.createElement('p');
lowestPriceWebText.textContent = `${lowestPrice} KR`;

const highestPriceWebText = document.createElement('p');
highestPriceWebText.textContent = `${highestPrice} KR`;

const lowestPriceWebTextKW = document.createElement('p');
lowestPriceWebTextKW.textContent = `PR. KWH`;

const highestPriceWebTextKW = document.createElement('p');
highestPriceWebTextKW.textContent = `PR. KWH`;

// Add the lowest and highest prices to the "lowestText" and "highestText" divs
lowestPriceTextDiv.appendChild(lowestPriceText);
highestPriceTextDiv.appendChild(highestPriceText);
lowestPriceWebTextDiv.appendChild(lowestPriceWebText);
highestPriceWebTextDiv.appendChild(highestPriceWebText);
lowestPriceWebTextDiv.appendChild(lowestPriceWebTextKW);
highestPriceWebTextDiv.appendChild(highestPriceWebTextKW)

    const oversigtDiv = document.createElement('div');
    oversigtDiv.id = "oversigt";

    // Display the price data for the next 24 hours
    pricesForNext24Hours.forEach((interval, index) => {
        const oversigtTextDiv = document.createElement("div");
        oversigtTextDiv.classList.add("oversigtText");
        
        const startTime = new Date(interval.time_start);
        const startTimeStr = formatTime(startTime);

        const timeIntervalText = document.createElement("p");
        timeIntervalText.textContent = `kl. ${startTimeStr}`;
        const oversigtPris = document.createElement("p");
        oversigtPris.textContent = `${interval.DKK_per_kWh} kr`;

        oversigtTextDiv.appendChild(timeIntervalText);
        oversigtTextDiv.appendChild(oversigtPris);
        oversigtDiv.appendChild(oversigtTextDiv);
    });

    // Add the "oversigt" div to the "oversigtData" div
    oversigtDataDiv.appendChild(oversigtDiv);
}


//historik.js

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

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function loadHistorikData(selectedDate) {
    const priceClass = 'DK2'; // Replace with the desired price class

    // Format the selected date manually as required by the API (YYYY/MM-DD)
    const formattedDate = selectedDate.getFullYear() + '/' +
        (selectedDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
        selectedDate.getDate().toString().padStart(2, '0');

    fetch(`https://www.elprisenligenu.dk/api/v1/prices/${formattedDate}_${priceClass}.json`)
        .then(response => {
            if (!response.ok) {
                throw Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Call the function to display the data in the HTML
            displayHistorikData(selectedDate, data);
        })
        .catch(error => {
            console.error("Failed to retrieve data from the API:", error);
        });
}

function displayHistorikData(selectedDate, data) {
    // Clear previous data
    document.getElementById("historikData").innerHTML = '';

    // Display the date
    document.getElementById("dateInput").textContent = selectedDate.toLocaleDateString("en-US");

    // Extract and display price data for the next 24 hours
    const pricesForNext24Hours = extractPriceForNext24Hours(data);

    pricesForNext24Hours.forEach(interval => {
        const startTime = new Date(interval.time_start);
        const startTimeStr = formatTime(startTime);

        // Create a new <p> element for the time
        const timeText = document.createElement("p");
        timeText.textContent = `kl. ${startTimeStr}`;

        // Create a new <p> element for the price
        const priceText = document.createElement("p");
        priceText.textContent = `${interval.DKK_per_kWh} kr`;

        const historyDiv = document.createElement("div");
        historyDiv.classList.add("historyDiv");
        document.getElementById('historikData').appendChild(historyDiv);
        // Append both <p> elements to the container
        historyDiv.appendChild(timeText);
        historyDiv.appendChild(priceText);
    });
}

// Initialize with the current date
const currentDate = new Date();
loadHistorikData(currentDate);