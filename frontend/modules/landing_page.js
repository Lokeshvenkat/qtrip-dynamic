import config from "../conf/index.js";

// Initializes the app by fetching cities and adding them to the DOM
async function init() {
  // Fetch list of cities with their details
  let cities = await fetchCities();
  console.log(cities);

  // If cities were fetched successfully, add each to the DOM
  if (cities) {
    cities.forEach((city) => {
      addCityToDOM(city.id, city.city, city.description, city.image);
    });
  }
}

// Fetches the list of cities from backend API and returns the JSON data
async function fetchCities() {
  try {
    let cityPromise = await fetch(config.backendEndpoint + "/cities");
    let cityData = await cityPromise.json();
    console.log(cityPromise);
    return cityData;
  } catch (err) {
    return null;
  }
}

// Creates city card elements and inserts them into the DOM
function addCityToDOM(id, city, description, image) {
  let container = document.createElement("div");
  container.setAttribute("class", "col-sm-6 col-lg-3 my-4");
  container.innerHTML = `
    <a href="pages/adventures/?city=${id}" id="${id}" target="_blank">
      <div class="tile">
        <img src="${image}">
        <div class="tile-text text-center">
          <h5>${city}</h5>
          <p>${description}</p>
        </div>
      </div>
    </a>
  `;
  let parent = document.getElementById("data");
  parent.append(container);
}

export { init, fetchCities, addCityToDOM };
