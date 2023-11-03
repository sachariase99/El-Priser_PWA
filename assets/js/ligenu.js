function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}/${month}-${day}`;
}

const prisKlasse = 'DK2';

function formatTime(dateTime) {
    return new Date(dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

fetch(`https://www.elprisenligenu.dk/api/v1/prices/${getCurrentDate()}_${prisKlasse}.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const pricesForCurrentTime = extractPriceForCurrentTime(data);
        displayligenuData(pricesForCurrentTime);
    })
    .catch(error => {
        console.error("Failed to retrieve data from the API:", error);
    });

function extractPriceForCurrentTime(data) {
    const currentTime = new Date();
    return data.filter(interval => {
        const intervalStart = new Date(interval.time_start);
        const intervalEnd = new Date(interval.time_end);
        return currentTime >= intervalStart && currentTime <= intervalEnd;
    });
}

function displayligenuData(pricesForCurrentTime) {
    const ligenuDataDiv = document.getElementById("ligenuData");
    const ligenuDiv = document.getElementById("ligenu");

    const startTime = new Date(pricesForCurrentTime[0].time_start);
    const endTime = new Date(pricesForCurrentTime[pricesForCurrentTime.length - 1].time_end);

    pricesForCurrentTime.forEach(interval => {
        const ligenuTextDiv = document.createElement("div");
        ligenuTextDiv.classList.add("ligenuText");
        ligenuDiv.appendChild(ligenuTextDiv);
    
        const roundedPrice = interval.DKK_per_kWh.toFixed(3);
        
        const ligenu = document.createElement("p");
        const ligenuKW = document.createElement("p");
        ligenu.textContent = `${roundedPrice} KR`;
        ligenuKW.textContent = `PR. KWH`;
        ligenuTextDiv.appendChild(ligenu);
        ligenuTextDiv.appendChild(ligenuKW);
    });
    
    const ligenuDataText = document.createElement("p");
    ligenuDataText.classList.add("priceDataText");
    ligenuDataText.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    ligenuDataDiv.appendChild(ligenuDataText);
}