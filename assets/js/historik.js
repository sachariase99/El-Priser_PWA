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

function loadPriceData(selectedDate) {
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
            console.log(data);
            // Clear previous data
            document.getElementById("priceData").innerHTML = '';

            // Display the date
            document.getElementById("currentDay").textContent = selectedDate.toLocaleDateString("en-US");
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
                document.getElementById('priceData').appendChild(historyDiv);
                // Append both <p> elements to the container
                historyDiv.appendChild(timeText);
                historyDiv.appendChild(priceText);
            });
        })
        .catch(error => {
            console.error("Failed to retrieve data from the API:", error);
        });
}

// Initialize with the current date
const currentDate = new Date();
loadPriceData(currentDate);