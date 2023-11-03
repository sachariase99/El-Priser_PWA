const customDropdown = document.getElementById("regionDropdown");
const svgElement = customDropdown.querySelector("svg");
let isRotated = false;

customDropdown.addEventListener("click", function () {
    this.classList.toggle("active");

    isRotated = !isRotated;
    if (isRotated) {
        svgElement.style.transform = "rotate(180deg)";
    } else {
        svgElement.style.transform = "rotate(0deg)";
    }
});