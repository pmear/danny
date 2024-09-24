let currentIndex = 0; // Track the current image index

// DOM Elements
const imageElement = document.getElementById("carousel-image");
const speciesElement = document.getElementById("species");
const observerElement = document.getElementById("observer");
const locationElement = document.getElementById("location");
const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");

const displayData = (data) => {
  imageElement.style.backgroundImage = `url(${data.photo})`;
  speciesElement.textContent = data.name;
  observerElement.textContent = data.observer;
  // locationElement.textContent = data.location;
  // timeElement.textContent = data.time;
  dateElement.textContent = data.date;
};

const init = () => {
  //first load the json file in the javascript
  fetch("./species.json")
    .then((response) => response.json())
    .then((json) => {
      //Check if the json file isnt empty
      if (json.length > 0) {
        //filter the entries without photos
        const filtered = json.filter((entry) => entry.photo !== "");
        //Display the first entry
        displayData(filtered[0]);
        //Regularly display the other entries, on loop
        setInterval(() => {
          currentIndex = (currentIndex + 1) % json.length;
          displayData(filtered[currentIndex]);
        }, 5000);
      }
    });
};

// Start the javascript on load of the page (literally just play the init function above)
window.addEventListener("load", init);
