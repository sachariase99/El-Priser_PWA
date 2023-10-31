// indstillinger.js

const customDropdown = document.getElementById("regionDropdown");
    const svgElement = customDropdown.querySelector("svg");
    let isRotated = false;

    customDropdown.addEventListener("click", function () {
        this.classList.toggle("active");

        // Rotate the SVG every time the dropdown is activated
        isRotated = !isRotated;
        if (isRotated) {
            svgElement.style.transform = "rotate(180deg)";
        } else {
            svgElement.style.transform = "rotate(0deg)";
        }
    });