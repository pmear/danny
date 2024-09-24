let currentIndex = 0; // Track the current image index

// DOM Elements
const imageElement = document.getElementById("carousel-image");
const speciesElement = document.getElementById("species");
const observerElement = document.getElementById("observer");
const locationElement = document.getElementById("location");
const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");

const displayData = (data) => {
  imageElement.style.backgroundImage = `url(${data.src})`;
  speciesElement.textContent = data.species;
  observerElement.textContent = data.observer;
  locationElement.textContent = data.location;
  timeElement.textContent = data.time;
  dateElement.textContent = data.date;
};

const init = () => {
  fetch("./data.json")
    .then((response) => response.json())
    .then((json) => {
      if (json.length > 0) {
        displayData(json[0]);
        setInterval(() => {
          currentIndex = (currentIndex + 1) % json.length;
          displayData(json[currentIndex]);
        }, 1000);
      }
    });
};

// Start the carousel when the page loads
window.addEventListener("load", init);
