import config from "../conf/index.js";

async function init() {
  let cities = await fetchCities();
  if (cities && Array.isArray(cities)) {
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  } else {
    console.error("No cities available to display.");
  }
}
async function fetchCities() {

  try {
    const response = await fetch(`${config.backendEndpoint}/cities`);
    if(!response.ok) {
      throw new Error(`Error fetching cities: ${response.statusText}`);
    }
    const cities = await response.json();
    return cities;
  } catch(error) {
    if(error) return null;
  }

}
function addCityToDOM(id, city, description, image) {
  const dataContainer = document.getElementById("data");
  if (!dataContainer) {
    console.error("No container found with id 'data'");
    return;
  }

  if (!id || !city || !description || !image) {
    console.error("Invalid city data:", { id, city, description, image });
    return;
  }

  const cityCard = document.createElement("div");
  cityCard.className = "col-12 col-md-6 col-lg-4 mb-4";
  cityCard.innerHTML = `
    <a id="${id}" href="./pages/adventures/?city=${id}" class="card text-dark">
      <img src="${image}" class="card-img-top" alt="${city}" />
      <div class="card-body">
        <h5 class="card-title">${city}</h5>
        <p class="card-text">${description}</p>
      </div>
    </a>
  `;

  dataContainer.appendChild(cityCard);
}

export { init, fetchCities, addCityToDOM };
