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

// Function to extract price data for the current time
function extractPriceForCurrentTime(data) {
    const currentTime = new Date();
    return data.filter(interval => {
        const intervalStart = new Date(interval.time_start);
        const intervalEnd = new Date(interval.time_end);
        return currentTime >= intervalStart && currentTime <= intervalEnd;
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
        // Extract price data for the current time
        const pricesForCurrentTime = extractPriceForCurrentTime(data);
        const priceDataDiv = document.getElementById("priceData");
        const ligenuDiv = document.getElementById("ligenu");
        // Get the start and end times for the data
        const startTime = new Date(pricesForCurrentTime[0].time_start);
        const endTime = new Date(pricesForCurrentTime[pricesForCurrentTime.length - 1].time_end);

        // Append the extracted data to the HTML
        pricesForCurrentTime.forEach(interval => {
            const ligenuTextDiv = document.createElement("div");
            ligenuTextDiv.classList.add("ligenuText")
            ligenuDiv.appendChild(ligenuTextDiv);
            const ligenu = document.createElement("p");
            const ligenuKW = document.createElement("p");
            ligenu.textContent = `${interval.DKK_per_kWh} KR`;
            ligenuKW.textContent = `PR. KWH`
            ligenuTextDiv.appendChild(ligenu);
            ligenuTextDiv.appendChild(ligenuKW);
        });

        // Display the time interval
        const priceDataText = document.createElement("p");
        priceDataText.classList.add("priceDataText")
        priceDataText.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
        priceDataDiv.appendChild(priceDataText);
    })
    .catch(error => {
        console.error("Failed to retrieve data from the API:", error);
    });
