import config from "../conf/index.js";

// Extracts the 'adventure' query parameter from the URL
function getAdventureIdFromURL(search) {
    let parameter = new URLSearchParams(search);
    return parameter.get("adventure");
}

// Fetches adventure details using the adventure ID
async function fetchAdventureDetails(adventureId) {
    try {
        let advProm = await fetch(
            config.backendEndpoint + "/adventures/detail?adventure=" + adventureId
        );
        let advData = await advProm.json();
        return advData;
    } catch (err) {
        return null;
    }
}

// Adds adventure details (name, subtitle, images, and content) to the DOM
function addAdventureDetailsToDOM(adventure) {
    document.getElementById("adventure-name").textContent = adventure.name;
    document.getElementById("adventure-subtitle").textContent = adventure.subtitle;

    let photos = document.getElementById("photo-gallery");
    adventure.images.forEach((link) => {
        photos.innerHTML += `<img src=${link} class="activity-card-image">`;
    });

    document.getElementById("adventure-content").textContent = adventure.content;
}

// Renders a Bootstrap image carousel for the adventure images
function addBootstrapPhotoGallery(images) {
    document.getElementById("photo-gallery").innerHTML = `
        <div id="carouselExampleIndicators" class="carousel slide">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner" id="car-inr"></div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>`;

    let carouselInner = document.getElementById("car-inr");
    images.forEach((link, index) => {
        let divInner = document.createElement("div");
        divInner.setAttribute("class", index === 0 ? "carousel-item active" : "carousel-item");
        divInner.innerHTML = `<img src=${link} class="d-block w-100 activity-card-image">`;
        carouselInner.append(divInner);
    });
}

// Displays the reservation panel or sold-out message based on adventure availability
function conditionalRenderingOfReservationPanel(adventure) {
    let reservation_available = document.getElementById("reservation-panel-available");
    let sold_out = document.getElementById("reservation-panel-sold-out");

    if (adventure.available === true) {
        reservation_available.style.display = "block";
        sold_out.style.display = "none";
        document.getElementById("reservation-person-cost").textContent = adventure.costPerHead;
    } else {
        reservation_available.style.display = "none";
        sold_out.style.display = "block";
    }
}

// Calculates total reservation cost and updates the DOM
function calculateReservationCostAndUpdateDOM(adventure, persons) {
    let cost = document.getElementById("reservation-cost");
    cost.textContent = adventure.costPerHead * persons;
}

// Handles reservation form submission and sends POST request to API
function captureFormSubmit(adventure) {
    let form = document.getElementById("myForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        let data = {
            name: event.target.elements.name.value,
            date: event.target.elements.date.value,
            person: event.target.elements.person.value,
            adventure: adventure.id
        };

        let resv = await fetch(config.backendEndpoint + "/reservations/new", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (resv.ok) {
            alert("Success!");
            location.reload();
        } else {
            alert("Failed!");
        }
    });
}

// Displays the reserved success banner if the user already has a reservation
function showBannerIfAlreadyReserved(adventure) {
    let reservation_banner = document.getElementById("reserved-banner");
    reservation_banner.style.display = adventure.reserved ? "block" : "none";
}

export {
    getAdventureIdFromURL,
    fetchAdventureDetails,
    addAdventureDetailsToDOM,
    addBootstrapPhotoGallery,
    conditionalRenderingOfReservationPanel,
    captureFormSubmit,
    calculateReservationCostAndUpdateDOM,
    showBannerIfAlreadyReserved,
};
