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

    const formattedDate = `${selectedDate.getFullYear()}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
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
    console.log(data);
    document.getElementById("historikData").innerHTML = '';

    document.getElementById("currentDay").textContent = selectedDate.toLocaleDateString("en-US");
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
        
        document.getElementById("historikData").appendChild(historyDiv);

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