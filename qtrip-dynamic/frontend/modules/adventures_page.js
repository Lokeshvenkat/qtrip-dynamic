import config from "../conf/index.js";
function getCityFromURL(search) {
  const params = new URLSearchParams(search);
  const city = params.get('city');
  console.log("Extracted city:", city);
  return city;

}
async function fetchAdventures(city) {
  try {
    const apiUrl = `${config.backendEndpoint}/adventures?city=${city}`;
    console.log("Fetching adventures from:", apiUrl);
    const response = await fetch(apiUrl);
    if(!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched adventures:", data);
    return data;
  } catch (error) {
    if(error) return null;
  }
}
function addAdventureToDOM(adventures) {
  const dataContainer = document.getElementById("data");

  dataContainer.innerHTML = "";

  adventures.forEach((adventure) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "col-12 col-md-6 col-lg-4 mb-4";
    const adventureLink = document.createElement("a");
    adventureLink.href = `detail/?adventure=${adventure.id}`;
    adventureLink.className = "text-decoration-none";
    adventureLink.id = adventure.id; 
    adventureLink.innerHTML = `
      <div class="activity-card">
        <img src="${adventure.image}" alt="${adventure.name}" class="img-fluid" />
        <div class="category-banner">${adventure.category}</div>

        <!-- Name and Cost section -->
        <div class="d-flex justify-content-between p-2">
          <div class="name-container">
            <h5 class="mb-0 px-3">${adventure.name}</h5>
          </div>
          <div class="cost-container">
            <p class="mb-0">₹${adventure.costPerHead}</p>
          </div>
        </div>

        <!-- Duration section -->
        <div class="d-flex justify-content-between p-2">
          <div class="duration-container">
            <p class="mb-0 px-2">Duration</p>
          </div>
          <div class="hours-container">
            <p class="mb-0">${adventure.duration} Hours</p>
          </div>
        </div>
      </div>
    `;
    cardDiv.appendChild(adventureLink);
    dataContainer.appendChild(cardDiv);
  });
}
function filterByDuration(list, low, high) {
  return list.filter((adventure) => adventure.duration >= low && adventure.duration <= high);

}
function filterByCategory(list, categoryList) {
  return list.filter((adventure) => categoryList.includes(adventure.category));

}
function filterFunction(list, filters) {
  let filteredList = list;
  if (filters.duration) {
    const [low, high] = filters.duration.split("-").map(Number);
    filteredList = filterByDuration(filteredList, low, high);
  }
  if (filters.category && filters.category.length > 0) {
    filteredList = filterByCategory(filteredList, filters.category);
  }

  return filteredList;
  return list;
}
function saveFiltersToLocalStorage(filters) {
  localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}
function getFiltersFromLocalStorage() {
  const filters = localStorage.getItem("filters");
  return filters ? JSON.parse(filters) : { duration: "", category: [] };
  return null;
}
function generateFilterPillsAndUpdateDOM(filters) {
  const categoryFilter = filters["category"];
  categoryFilter.forEach(key => {
    let newElem = document.createElement("div");
    newElem.className = "category-filter";
    newElem.innerHTML = `
    <div> ${key} </div>
    `;
    document.getElementById("category-list").appendChild(newElem);
  });
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};

