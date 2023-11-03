// oversigt
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}/${month}-${day}`;
}

const priceClass = 'DK2';

function formatTime(dateTime) {
    return new Date(dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

fetch(`https://www.elprisenligenu.dk/api/v1/prices/${getCurrentDate()}_${priceClass}.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
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

const oversigtDataDiv = document.getElementById('oversigtData');

const lowestPriceTextDiv = document.getElementById('lowestText');

const highestPriceTextDiv = document.getElementById('highestText');

const lowestPriceWebTextDiv = document.getElementById('lowestTextWeb');

const highestPriceWebTextDiv = document.getElementById('highestTextWeb');

lowestPriceTextDiv.innerHTML = '';
highestPriceTextDiv.innerHTML = '';
lowestPriceWebTextDiv.innerHTML = '';
highestPriceWebTextDiv.innerHTML = '';

const lowestPriceText = document.createElement('p');
lowestPriceText.classList.add('lowestPrice');
const roundedLowestPrice = lowestPrice.toFixed(3);
lowestPriceText.textContent = `${roundedLowestPrice} KR`;

const highestPriceText = document.createElement('p');
highestPriceText.classList.add('highestPrice');
const roundedHighestPrice = highestPrice.toFixed(3);
highestPriceText.textContent = `${roundedHighestPrice} KR`;

const lowestPriceTextKW = document.createElement('p');
lowestPriceTextKW.classList.add('lowestPriceKW');
lowestPriceTextKW.textContent = `PR. KWH`;

const highestPriceTextKW = document.createElement('p');
highestPriceTextKW.classList.add('highestPriceKW');
highestPriceTextKW.textContent = `PR. KWH`;

const lowestPriceWebText = document.createElement('p');
lowestPriceWebText.classList.add('lowestPrice')
lowestPriceWebText.textContent = `${roundedLowestPrice} KR`;

const highestPriceWebText = document.createElement('p');
highestPriceWebText.classList.add('highestPrice')
highestPriceWebText.textContent = `${roundedHighestPrice} KR`;

const lowestPriceWebTextKW = document.createElement('p');
lowestPriceWebTextKW.classList.add('lowestPriceKW')
lowestPriceWebTextKW.textContent = `PR. KWH`;

const highestPriceWebTextKW = document.createElement('p');
highestPriceWebTextKW.classList.add('highestPriceKW')
highestPriceWebTextKW.textContent = `PR. KWH`;

lowestPriceTextDiv.appendChild(lowestPriceText);
highestPriceTextDiv.appendChild(highestPriceText);
lowestPriceTextDiv.appendChild(lowestPriceTextKW);
highestPriceTextDiv.appendChild(highestPriceTextKW)
lowestPriceWebTextDiv.appendChild(lowestPriceWebText);
highestPriceWebTextDiv.appendChild(highestPriceWebText);
lowestPriceWebTextDiv.appendChild(lowestPriceWebTextKW);
highestPriceWebTextDiv.appendChild(highestPriceWebTextKW)

    const oversigtDiv = document.createElement('div');
    oversigtDiv.id = "oversigt";

pricesForNext24Hours.forEach((interval, index) => {
    const oversigtTextDiv = document.createElement("div");
    oversigtTextDiv.classList.add("oversigtText");

    const startTime = new Date(interval.time_start);
    const startTimeStr = formatTime(startTime);

    const timeIntervalText = document.createElement("p");
    timeIntervalText.textContent = `kl. ${startTimeStr}`;

    const roundedPrice = interval.DKK_per_kWh.toFixed(3);
    const oversigtPris = document.createElement("p");
    oversigtPris.textContent = `${roundedPrice} kr`;

    oversigtTextDiv.appendChild(timeIntervalText);
    oversigtTextDiv.appendChild(oversigtPris);
    oversigtDiv.appendChild(oversigtTextDiv);
});

    oversigtDataDiv.appendChild(oversigtDiv);
}


// Historik
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
    const priceClass = 'DK2';

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
            displayHistorikData(selectedDate, data);
        })
        .catch(error => {
            console.error("Failed to retrieve data from the API:", error);
        });
}

function displayHistorikData(selectedDate, data) {
    document.getElementById("historikData").innerHTML = '';

    document.getElementById("dateInput").textContent = selectedDate.toLocaleDateString("en-US");

    const pricesForNext24Hours = extractPriceForNext24Hours(data);

    pricesForNext24Hours.forEach(interval => {
        const startTime = new Date(interval.time_start);
        const startTimeStr = formatTime(startTime);
    
        const timeText = document.createElement("p");
        timeText.textContent = `kl. ${startTimeStr}`;
    
        const roundedPrice = interval.DKK_per_kWh.toFixed(3);
        const priceText = document.createElement("p");
        priceText.textContent = `${roundedPrice} kr`;
    
        const historyDiv = document.createElement("div");
        historyDiv.classList.add("historyDiv");
        document.getElementById('historikData').appendChild(historyDiv);
    
        historyDiv.appendChild(timeText);
        historyDiv.appendChild(priceText);
    });    
}

document.addEventListener("DOMContentLoaded", function () {
    const currentDate = new Date();
    loadHistorikData(currentDate);

    const dateInputCalendar = document.getElementById("dateInputCalendar");

    dateInputCalendar.addEventListener("change", function () {
        const selectedDate = new Date(dateInputCalendar.value);
        loadHistorikData(selectedDate);
    });
});