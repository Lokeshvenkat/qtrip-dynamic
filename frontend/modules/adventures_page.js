import config from "../conf/index.js";

// Extracts the 'city' query parameter from the URL search string
function getCityFromURL(search) {
  let parameter = new URLSearchParams(search);
  return parameter.get("city");
}

// Fetches adventures from the backend API filtered by city
async function fetchAdventures(city) {
  try {
    let cityProm = await fetch(config.backendEndpoint + "/adventures?city=" + city);
    let cityData = await cityProm.json();
    return cityData;
  } catch (err) {
    return null;
  }
}

// Creates and appends adventure cards to the DOM for each adventure object
function addAdventureToDOM(adventures) {
  adventures.forEach((adv) => {
    let container = document.createElement("div");
    container.setAttribute("class", "col-sm-6 col-lg-3 my-4");
    container.innerHTML += `
      <a href="detail/?adventure=${adv.id}" id="${adv.id}" target="_blank">
        <div class="activity-card">
          <div class="category-banner">
            <h5 class="my-0">${adv.category}</h5>
          </div>
          <img src="${adv.image}">
          <div class="d-flex justify-content-between align-items-center py-2" style="width: 90%">
            <div>
              <h6>${adv.name}</h6>
              <h6>Duration</h6>
            </div>
            <div>
              <h6>${adv.currency} ${adv.costPerHead}</h6>
              <h6>${adv.duration} Hours</h6>
            </div>
          </div>
        </div>
      </a>
    `;
    let parent = document.getElementById("data");
    parent.append(container);
  });
}

// Filters adventures based on duration range (inclusive)
function filterByDuration(list, low, high) {
  let advByDuration = [];
  list.forEach((adv) => {
    if (adv.duration >= low && adv.duration <= high) {
      advByDuration.push(adv);
    }
  });
  return advByDuration;
}

// Filters adventures based on matching categories in categoryList
function filterByCategory(list, categoryList) {
  let advByCategory = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < categoryList.length; j++) {
      if (list[i].category === categoryList[j]) {
        advByCategory.push(list[i]);
      }
    }
  }
  return advByCategory;
}

// Combines filtering by duration and/or category depending on filters object
function filterFunction(list, filters) {
  if (filters.duration.length !== 0 && filters.category.length === 0) {
    let [low, high] = filters.duration.split("-");
    return filterByDuration(list, low, high);
  } else if (filters.category.length !== 0 && filters.duration.length === 0) {
    return filterByCategory(list, filters.category);
  } else if (filters.duration.length !== 0 && filters.category.length !== 0) {
    let [low, high] = filters.duration.split("-");
    let filByDuration = filterByDuration(list, low, high);
    let filByCategory = filterByCategory(list, filters.category);

    // Find common adventures present in both filtered lists by matching IDs
    let filByDurationIds = filByDuration.map((adv) => adv.id);
    let filteredAdvs = filByCategory.filter((advs) => filByDurationIds.includes(advs.id));

    return filteredAdvs;
  }

  // If no filters are applied, return original list
  return list;
}

// Saves the filters object to localStorage as a JSON string
function saveFiltersToLocalStorage(filters) {
  localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

// Retrieves filters from localStorage and parses them back to an object
function getFiltersFromLocalStorage() {
  let filItems = JSON.parse(localStorage.getItem("filters"));
  return filItems;
}

// Updates the filter UI elements: duration dropdown and category pills based on filters
function generateFilterPillsAndUpdateDOM(filters) {
  document.getElementById("duration-select").value = filters.duration;
  let categoryFils = document.getElementById("category-list");

  filters.category.forEach((fils) => {
    categoryFils.innerHTML += `
      <div class="category-filter">
        ${fils}
      </div>
    `;
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
