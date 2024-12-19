import config from "../conf/index.js";

function getAdventureIdFromURL(search) {
  try {

    const urlParams = new URLSearchParams(search);
    const adventureId = urlParams.get("adventure");

    if (!adventureId) throw new Error("Adventure ID not found in URL");

    return adventureId;
  } catch (error) {
    console.error("Error extracting Adventure ID from URL:", error);
    return null; 
  }
}
async function fetchAdventureDetails(adventureId) {

  
  try {
    if (!adventureId) throw new Error("Invalid Adventure ID");

    console.log("Fetching details for Adventure ID:", adventureId);

    const response = await fetch(
      `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`
    );

    console.log("Fetch Response Status:", response.status);

    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    const responseText = await response.text();
    if (!responseText) throw new Error("Empty response body");

    const adventureDetails = JSON.parse(responseText);
    console.log("Adventure Details:", adventureDetails);
    return adventureDetails;
  } catch (error) {
    console.error("Error fetching adventure details:", error);
    return null;
  }
}
function addAdventureDetailsToDOM(adventure) {
  const { name, subtitle, images, content } = adventure;
  const adventureNameElement = document.getElementById("adventure-name");
  adventureNameElement.textContent = name;
  const adventureSubtitleElement = document.getElementById("adventure-subtitle");
  adventureSubtitleElement.textContent = subtitle;
  const photoGallery = document.getElementById("photo-gallery");
  images.forEach((imageUrl) => {
    const imageDiv = document.createElement("div");
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.alt = name;
    imageElement.className = "activity-card-image";
    imageDiv.appendChild(imageElement);
    photoGallery.appendChild(imageDiv);
  });
  const adventureContentElement = document.getElementById("adventure-content");
  adventureContentElement.textContent = content;
}
function addBootstrapPhotoGallery(images) {
  const photoGallery = document.getElementById('photo-gallery');
  const carousel = document.createElement('div');
  carousel.id = 'carouselExampleIndicators';
  carousel.className = 'carousel slide';
  carousel.setAttribute('data-bs-ride', 'carousel');
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';
  images.forEach((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-bs-target', '#carouselExampleIndicators');
    button.setAttribute('data-bs-slide-to', index);
    if (index === 0) {
      button.className = 'active';
      button.setAttribute('aria-current', 'true');
    }
    button.setAttribute('aria-label', `Slide ${index + 1}`);
    indicators.appendChild(button);
  });
  const carouselInner = document.createElement('div');
  carouselInner.className = 'carousel-inner';
  images.forEach((image, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item${index === 0 ? ' active' : ''}`;

    const img = document.createElement('img');
    img.src = image;
    img.className = 'd-block w-100 activity-card-image';
    img.alt = `Slide ${index + 1}`;

    carouselItem.appendChild(img);
    carouselInner.appendChild(carouselItem);
  });

  const prevControl = `
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
  `;

  const nextControl = `
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  `;
  carousel.appendChild(indicators);
  carousel.appendChild(carouselInner);
  carousel.innerHTML += prevControl + nextControl;
  photoGallery.innerHTML = '';
  photoGallery.appendChild(carousel);
}
function conditionalRenderingOfReservationPanel(adventure) {
  const soldOutPanel = document.getElementById("reservation-panel-sold-out");
    const availablePanel = document.getElementById("reservation-panel-available");
    const costPerHeadElement = document.getElementById("reservation-person-cost");

    if (adventure.available) {
        soldOutPanel.style.display = "none";
        availablePanel.style.display = "block";
        if (costPerHeadElement) {
            costPerHeadElement.textContent = adventure.costPerHead;
        }
    } else {
        soldOutPanel.style.display = "block";
        availablePanel.style.display = "none";
    }
}
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  const totalCostElement = document.getElementById("reservation-cost");
    const totalCost = persons * adventure.costPerHead;
    if (totalCostElement) {
        totalCostElement.textContent = totalCost;
    }
}
function captureFormSubmit(adventure) {
  const form = document.getElementById("myForm");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const name = formData.get("name");
            const date = formData.get("date");
            const person = formData.get("person");
            const reservationData = {
                name: name,
                date: date,
                person: parseInt(person, 10),
                adventure: adventure.id,
            };
            try {
                const response = await fetch(`${config.backendEndpoint}/reservations/new`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reservationData),
                });
                if (response.ok) {
                    const responseData = await response.json();

                    if (responseData.success) {
                        alert("Success!");
                        window.location.reload();
                    } else {
                        alert("Failed!");
                    }
                } else {
                    alert("Failed!");
                }
            } catch (error) {
                console.error("Error while submitting reservation:", error);
                alert("Failed!");
            }
        });
    }
}
function showBannerIfAlreadyReserved(adventure) {
  const reservedBanner = document.getElementById("reserved-banner");
    if (reservedBanner) {
        if (adventure.reserved) {
            reservedBanner.style.display = "block";
        } else {
            reservedBanner.style.display = "none";
        }
    }
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

